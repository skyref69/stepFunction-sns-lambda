import { aws_iam, aws_lambda, aws_lambda_nodejs, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { StateMachine, Wait, WaitTime } from 'aws-cdk-lib/aws-stepfunctions';
import { Topic } from 'aws-cdk-lib/aws-sns';
export class StepFunctionSnsLambdaStack extends Stack {

  public Machine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);   
    
    // ------------------------------------------------------------
    // ---------------- STEP FUNCTION SECTION ---------------------
    // ------------------------------------------------------------  
    
    // Create an SNS Topic
    const topic = new Topic(this, 'Topic777');
    
    // Lambda to publish message to sns
    const fnPublishSns = new aws_lambda_nodejs.NodejsFunction(this,"publishSns",{
      runtime: aws_lambda.Runtime.NODEJS_14_X,      
      entry: 'lambda/publishSns.ts',
      handler: 'publishSns', 
      environment: {
        SNS_TOPIC_ARN: topic.topicArn,
        REGION: 'us-east-1',
      }
    });
    // INVOCATION Lambda to publish message to sns
    const invokeSns = new LambdaInvoke(this, 'publish Sns', {
      lambdaFunction: fnPublishSns,   
      outputPath: '$',
    });
    
    // Lambda role for publish in sns
    topic.grantPublish(fnPublishSns);
    //_______________________________________________________________________________________
    

     // Lambda for update state vote db
     const updateStateVoteDb = new aws_lambda_nodejs.NodejsFunction(this,"updateStateVoteDb",{
      runtime: aws_lambda.Runtime.NODEJS_14_X,      
      entry: 'lambda/updateStateVoteDb.ts',
      handler: 'updateStateVoteDb', 
      environment: {
        SNS_TOPIC_ARN: topic.topicArn,
        REGION: 'us-east-1',
      },
      timeout: Duration.seconds(3),
    });
    // INVOCATION lambda for update state vote db
    const invokeUpdateDb = new LambdaInvoke(
      this, 
      'update state vote db',
      {
        lambdaFunction: updateStateVoteDb,
        payload: sfn.TaskInput.fromObject({
          token: sfn.JsonPath.taskToken,
          request: sfn.JsonPath.entirePayload,     
        }),
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
        timeout: Duration.minutes(4),
        resultPath: '$.lambda',
      }
    );
    //_______________________________________________________________________________________

  
    // Condition to wait 1 second
    const wait1Second = new Wait(this, "Wait 1 Second", {
      time: WaitTime.duration(Duration.seconds(1)),
    });    

    // Create the workflow definition   
    const definition = invokeSns.next(wait1Second).next(invokeUpdateDb);

    // Create the statemachine
    const stepFunction = new StateMachine(this, "StateMachine", {
      definition,
      stateMachineName: 'publishSns-StateMachine',
      timeout: Duration.minutes(5)
    });  
    
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    
    // Create Lambda to start StepFunction
    const lambdaStartStepFunction = new aws_lambda_nodejs.NodejsFunction(this,"LambdaStartStepFunction",{
      runtime: aws_lambda.Runtime.NODEJS_14_X,      
      entry: 'lambda/LamdaStartStepFunction.ts',
      handler: 'LambdaStartStepFunction',       
      timeout: Duration.seconds(3),
    })   
    
    // 
    lambdaStartStepFunction.addToRolePolicy(new aws_iam.PolicyStatement({      
      actions: ['states:StartExecution'],
      effect: aws_iam.Effect.ALLOW,
      resources: [stepFunction.stateMachineArn]
    }))

    lambdaStartStepFunction.addToRolePolicy(new aws_iam.PolicyStatement({      
      actions: ['states:SendTaskSuccess'],
      effect: aws_iam.Effect.ALLOW,
      resources: [stepFunction.stateMachineArn]
    }))

    
    
  }
}


