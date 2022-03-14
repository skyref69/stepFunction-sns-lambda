import * as AWS from 'aws-sdk';

interface IstateVote {
  stateVote: string,
}

export const LambdaStartStepFunction = (event: IstateVote) => {
    
    let params = {
        stateMachineArn: 'arn:aws:states:us-east-1:159383912594:stateMachine:publishSns-StateMachine',
        input: JSON.stringify({"stateVote": "open"}),
    }
    let stepfunctions = new AWS.StepFunctions();
    let response;

    stepfunctions.startExecution(params, (err, data) => {
        if (err) {
            console.log(err);
            response = {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'There was an error'
                })
            };        
        } else {
            console.log(data);
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Step function worked'
                })
            };        
        }
        console.log(response);        
    });    
    
};

