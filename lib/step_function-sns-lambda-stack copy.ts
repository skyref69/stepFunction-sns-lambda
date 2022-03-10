import * as lambda from '@aws-cdk/aws-lambda';
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cdk from '@aws-cdk/core';
import { SnsPublish } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as path from 'path';7
import * as sfn from '@aws-cdk/aws-stepfunctions';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'sns-topic', {
      displayName: 'My SNS topic',
    });

    // const message = 'ciaooo';
    
    // new SnsPublish(this, 'Publish message', {
    //   topic: new sns.Topic(this, 'cool-topic'),
    //   message: sfn.TaskInput.fromJsonPathAt('$.message'),
    //   resultPath: '$.sns',
    // });
    
  }
}
