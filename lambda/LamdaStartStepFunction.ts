import * as AWS from 'aws-sdk';

interface IstateVote {  
  puntata: number,
  televoto: string,
  canale: string,
  stateVote: string, // open|close
  taskToken: string  // from Step Function
}

export const LambdaStartStepFunction = (event: IstateVote) => {
    
    const stateVote = event.stateVote; 
    const taskToken = event.taskToken;   
    
    let stepfunctions = new AWS.StepFunctions();
      
    if(stateVote=='open'){      
        console.log('APERTURA !!');  
      let params = {
          stateMachineArn: 'arn:aws:states:us-east-1:159383912594:stateMachine:publishSns-StateMachine',
          input: JSON.stringify({"stateVote": "open"}),
      }
      stepfunctions.startExecution(params, (err, data) => {        
        if (err) console.log(err);         
        else console.log('Start function started');
      });
    }else if(stateVote=='closed'){
        console.log('CHIUSURA !!');
        let params = {
            output: '{}',
            taskToken: taskToken
        }        
        stepfunctions.sendTaskSuccess(params, (err, data) => {
            if (err) console.log(err, err.stack); 
            else     console.log('Send task success');  
        });        
    }
        
    
};

