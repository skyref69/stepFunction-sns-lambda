import { aws_lambda, aws_lambda_nodejs, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { EvaluateExpression, LambdaInvoke, SnsPublish } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { StateMachine, Wait, WaitTime } from 'aws-cdk-lib/aws-stepfunctions';
import { Subscription, Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription, SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as cdk from '@aws-cdk/core';


export class StepFunctionSnsLambdaStack extends Stack {

  public Machine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // const myQueue = new sqs.Queue(this, 'MyQueue1');
    // const myTopic = new sns.Topic(this, 'MyTopic1');

    // myTopic.addSubscription(new SqsSubscription(myQueue));  
    
    // Create an SNS Topic
    
    // topic to publish our message to
    const topic = new Topic(this, 'Topic777')
    
    // Lambda per pubblicare un messaggio
    const fn = new aws_lambda_nodejs.NodejsFunction(this,"publishSns",{
      runtime: aws_lambda.Runtime.NODEJS_14_X,      
      entry: 'lambda/publishSns.ts',
      handler: 'publishSns', 
      environment: {
        SNS_TOPIC_ARN: topic.topicArn,
        REGION: 'us-east-1',
      }
    });

    topic.grantPublish(fn);

    
    

  
    
   

  }
}


