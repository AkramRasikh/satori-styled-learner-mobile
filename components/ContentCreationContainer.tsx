import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, IconButton, Button, Card} from 'react-native-paper';
import EditableField from './EditableField';

const AddContentForm = ({setAddContentFormState}) => {
  const [fields, setFields] = useState([
    {sentence: '', context: '', showContext: false},
  ]);

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const toggleContextField = index => {
    const updated = [...fields];
    updated[index].showContext = !updated[index].showContext;
    setFields(updated);
  };

  const addNewField = () => {
    setFields([...fields, {sentence: '', context: '', showContext: false}]);
  };

  const handleSubmit = () => {
    const result = fields.map(({sentence, context}) => ({
      sentence,
      context: context || '',
    }));
    console.log('## result', result);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Text variant="titleSmall">Content ({fields.length} sentences)</Text>
          <IconButton
            icon="close"
            onPress={() => setAddContentFormState(false)}
          />
        </View>

        <ScrollView>
          {fields.map((field, index) => (
            <View key={index} style={styles.inputGroup}>
              <EditableField
                value={field.sentence}
                onChange={val => handleFieldChange(index, 'sentence', val)}
                placeholder={`Content ${index + 1}`}
              />

              <Button mode="text" onPress={() => toggleContextField(index)}>
                {field.showContext ? 'Remove Context' : 'Add Context'}
              </Button>

              {field.showContext && (
                <EditableField
                  value={field.context}
                  onChange={val => handleFieldChange(index, 'context', val)}
                  placeholder="Context (optional)"
                />
              )}
            </View>
          ))}
        </ScrollView>

        <Button mode="contained" onPress={addNewField} style={styles.button}>
          Add Another Line
        </Button>

        <Button
          mode="contained-tonal"
          onPress={handleSubmit}
          style={styles.button}>
          Submit
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    marginVertical: 8,
  },
  editableContainer: {
    marginBottom: 8,
  },
  input: {
    textAlignVertical: 'top',
  },
  staticText: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    minHeight: 60,
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    marginTop: 10,
  },
});

export default AddContentForm;
