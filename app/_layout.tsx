import { useCallback, useEffect, useState } from "react";

import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
} from "react-native";

import { Amplify } from "aws-amplify";
import { DataStore } from "aws-amplify/datastore";

import amplifyconfig from "../amplifyconfiguration.json";

import { LazyTodo, Todo } from "../models";

Amplify.configure(amplifyconfig);

export default function RootLayout() {
  const [data, query, add, remove] = useAmplifyData();

  const [input, setInput] = useState<string>("");

  const commit = () => {
    add(input);
    setInput("");
  };

  useEffect(() => {}, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.add_container}>
        <View style={styles.add_textinput}>
          <TextInput onChangeText={setInput} value={input} />
        </View>
        <View style={styles.add_button}>
          <Button onPress={commit} title="Add" color="#841584" />
        </View>
        <View style={styles.refresh_button}>
          <Button onPress={query} title="Refresh" color="#23A760" />
        </View>
      </View>

      <View style={styles.legend_box}>
        <Text style={styles.legend_header}>List To Do 1</Text>
        <FlatList<LazyTodo>
          data={data}
          renderItem={({ item }) => <Item data={item} onDelete={remove} />}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.legend_box}>
        <Text style={styles.legend_header}>List To Do 2</Text>
        <Text>Some Text or control</Text>
      </View>
    </SafeAreaView>
  );
}

type ItemProps = { data: LazyTodo; onDelete?: (record: LazyTodo) => void };

const Item = ({ data, onDelete }: ItemProps) => {
  const remove = () => {
    if (onDelete) {
      onDelete(data);
    }
  };

  return (
    <View style={styles.list_item_container}>
      <Text style={styles.list_item_id}>{data.id}</Text>
      <Text style={styles.list_item_title}>{data.text}</Text>
      <View style={styles.list_item_delete}>
        <Button
          onPress={remove}
          title="DELETE"
          color="#E01212"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </View>
  );
};

function useAmplifyData() {
  const [data, setData] = useState<LazyTodo[]>([]);

  const sorter = (a: LazyTodo, b: LazyTodo) => {
    const _a = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const _b = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return _b - _a;
  };

  const query = useCallback(() => {
    DataStore.query(Todo).then((models) => setData(models.sort(sorter)));
  }, [data, setData]);

  const add = useCallback((text: string): void => {
    DataStore.save(
      new Todo({
        text: text,
      })
    ).then((newdata: LazyTodo) => {
      console.log("Inserted", newdata);
      query();
    });
  }, []);

  const remove = useCallback((data: LazyTodo) => {
    DataStore.delete(data).then((removed: LazyTodo) => {
      console.log("Removed", removed);
      query();
    });
  }, []);

  useEffect(() => {
    query();
  }, []);

  return [data, query, add, remove] as [
    LazyTodo[],
    () => void,
    (text: string) => void,
    (data: LazyTodo) => void
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    padding: 8,
  },
  add_container: {
    padding: 8,
    flexDirection: "row",
  },
  add_textinput: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    padding: 4,
    flexGrow: 1,
    marginRight: 8,
  },
  add_button: {
    width: 100,
    borderRadius: 8,
  },
  refresh_button: {
    width: 100,
    borderRadius: 8,
    marginLeft: 8,
  },
  legend_box: {
    margin: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
    paddingTop: 16,
    maxHeight: 300,
  },
  legend_header: {
    position: "absolute",
    top: -10,
    left: 10,
    fontWeight: "bold",
    paddingHorizontal: 4,
    backgroundColor: "azure",
  },
  list_item_container: {
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    marginVertical: 2,
    padding: 4,
  },
  list_item_title: {
    width: 300,
  },
  list_item_id: {
    width: 300,
  },
  list_item_delete: {},
});
