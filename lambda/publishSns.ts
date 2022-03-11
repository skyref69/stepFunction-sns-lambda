import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";

export const publishSns = async(event: any) => {  
    
  console.log(event);

    const sns = new SNSClient('$.process.env.AWS_DEFAULT_REGION');    
    const publishCommand = new PublishCommand({
        Message: `Sent message test`,        
        TopicArn: process.env.SNS_TOPIC_ARN,
      });    
    await sns.send(publishCommand);
    console.log('---> ' + process.env.AWS_SESSION_TOKEN);
    return process.env.AWS_SESSION_TOKEN;
};
 