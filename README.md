# 📚 Bookkeeper 📚

## 📙 Motivation

While building a few WebSocket-based applications, I noticed a pattern appears in every one of them.

When a module subscribes to a topic on WebSocket, a mediator sends a subscribe request to the WebSocket server and 
an unsubscribe request when the topic is no longer subscribed by any modules. In order to achieve this, the mediator
requires to keep records of the subscribers and their callback functions and count the number of subscribers of each
topic. When the total number changes from 0 to 1, it should send a subscribe request. When the total number changes from
1 to 0, it should send an unsubscribe request. These logics appear in all the `subscribe` and `unsubscribe` functions
so I decided to extract these logics and make them reusable across projects.

## 📕 Usage


### Setup
```
  import Bookkeeper from 'path/to/bookkeeper';

  // Create an instance of Bookkeeper
  const bookkeeper = new Bookkeeper();
```

### Get Notified
```
  // Get notified when the first element of the list of specified key is added
  bookkeeper.on('new', (key) => {
    console.log(`The first element of list ${key} has been added`);
  });
  
  // Get notified when the last element of the list of specified key is removed
  bookkeeper.on('outdated', (key) => {
    console.log(`The last element of list ${key} has been removed`);
  });
```

### Add and Remove List Items
```
  // LIST_1 = [VALUE_1] (triggering `new` event)
  bookkeeper.add('LIST_1', 'VALUE_2');
   
  // LIST_1 = [VALUE_1, VALUE_2]
  bookkeeper.add('LIST_1', 'VALUE_1');
   
  // LIST_1 = [VALUE_1]
  bookkeeper.remove('LIST_1', 'VALUE_2');  
  
  // LIST_1 list is removed entirely (triggering `outdated` event)
  bookkeeper.remove('LIST_1', 'VALUE_2');  
```

### More APIs
```
  // Return all existing lists
  bookkeeper.getKeys(); 
  
  // Return all values of a list (e.g. [VALUE_1, VALUE_2])
  bookkeeper.getValuesByKey('LIST_1');
  
  // Return the key of the first list that contains the specified value 
  bookkepper.getKeyByValue('VALUE_1');
```

## 📗 License

MIT
