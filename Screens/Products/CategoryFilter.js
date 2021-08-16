import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Badge, Text, Item } from 'native-base';

const CategoryFilter = (props) => {
  return (
    <ScrollView bounces={true} horizontal={true} style={styles.scrollView}>
      <ListItem style={styles.listItem}>
        <TouchableOpacity
          key={1}
          onPress={() => {
            props.categoryFilter('all');
            props.setActive(-1);
          }}
        >
          <Badge
            style={[
              styles.badge,
              props.active == -1 ? styles.active : styles.inActive,
            ]}
          >
            <Text style={styles.text}>All</Text>
          </Badge>
        </TouchableOpacity>
        {props.categories.map((category) => (
          <TouchableOpacity
            key={category._id.$oid}
            onPress={() => {
              props.categoryFilter(category._id.$oid);
              props.setActive(props.categories.indexOf(category));
            }}
          >
            <Badge
              style={[
                styles.badge,
                props.active == props.categories.indexOf(category)
                  ? styles.active
                  : styles.inActive,
              ]}
            >
              <Text style={styles.text}>{category.name}</Text>
            </Badge>
          </TouchableOpacity>
        ))}
      </ListItem>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f2f2f2',
  },
  listItem: {
    margin: 0,
    padding: 0,
    borderRadius: 0,
  },
  badge: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  active: {
    backgroundColor: '#03bafc',
  },
  inActive: {
    backgroundColor: '#a0e1eb',
  },
});

export default CategoryFilter;
