import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";

interface IstateVote {
  stateVote: string,
}

export const publishSns = async(event: IstateVote) => {
  const sns = new SNSClient('$.process.env.AWS_DEFAULT_REGION');    
  const publishCommand = new PublishCommand({
    Message: event.stateVote,        
    TopicArn: process.env.SNS_TOPIC_ARN,
  });
  try {
    await sns.send(publishCommand);
    console.log('Write into SNS');    
  } catch (error) {
    console.log('Error write into SNS');    
  }
}; 