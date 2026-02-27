### 1.9.6

- [dev] toolchain updated to tsup

### 1.9.5

- [fix] d.ts exports IEventConfig type

### 1.9.4

- [fix] DataTree incorrectly defines item index within parent data

### 1.9.3

- [fix] Regression in deleting top-level items in DataTree

### 1.9.2

- [update] DataTree recreates item and branche after deleting last item in a branch

### 1.9.1

- [update] DataTree recreates item and branche objects on updates

### 1.9.0

- [dev] public version released

### 1.8.1

- [fix] isSame ignores case when some key on a source object was deleted

### 1.8.0

- [add] deepCopy helper
- [add] isSame helper

### 1.7.1

- [fix] returning empty array from toArray if the tree is empty
- [fix] d.ts exports IPublicWritable type

### 1.7.0

- [add] ability to use objects in the store, where each property of the object will be converted to reactive state var
- [add] ability to use async / delayed ops in the DataRouter
