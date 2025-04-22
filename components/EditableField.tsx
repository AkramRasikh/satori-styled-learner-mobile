import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, TextInput} from 'react-native-paper';

const EditableField = ({value, onChange, placeholder}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  const handleBlur = () => {
    setIsEditing(false);
    onChange(internalValue);
  };

  return (
    <View style={styles.editableContainer}>
      {isEditing ? (
        <TextInput
          value={internalValue}
          onChangeText={setInternalValue}
          onBlur={handleBlur}
          autoFocus
          mode="outlined"
          multiline
          style={styles.input}
        />
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Text style={styles.staticText}>
            {internalValue.trim() || `Tap to add ${placeholder}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
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

export default EditableField;
