
import { Text } from 'react-native';
import { DataStore } from 'aws-amplify/datastore';
import { Todo } from '../models';

import { Amplify } from "aws-amplify";
import amplifyconfig from "../amplifyconfiguration.json";
import { useEffect } from 'react';

Amplify.configure(amplifyconfig);

export default function RootLayout() {

  useEffect(() => {
    // DataStore.save(
    //   new Todo({
    //     "text": "Lorem ipsum dolor sit amet"
    //   })
    // );

    DataStore.query(Todo)
      .then(models => console.log(models));
  }, []);

  return <Text>test</Text>;
}
