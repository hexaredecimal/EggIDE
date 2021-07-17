!EGG PROGRAMMING LANGUAGE 

egg is a simple but elegant programing language. It is small but yet packs a lot power and capabilities. It follows the functional programming paradigm. 
Here is a list of features

   * function declaration and calls
   * function return (expr and func decl)
   * safe code execution

The language is massively small and some might find it slow, that is due to the implementation language and writing non-optimised code.
I'll try and optimise it some other time.

!tutorial

1. Greetings
```
    do(
       print("Hello, world!!")
    )
```
    -- Here we use do to involve the evaluator and create a new scope.
    -- do is a built-in function which takes an unlimited number of arguments
    -- in Egg all statements return a value
    -- The evaluator will start executing from this point
    -- print is a built-in function for writing to the console

2. Variables

```
    do(
       define(x,10),
       print(x)
    )

```
   -- define is a built-in function for creating variables
   -- it takes the first argument as a name and the other as value
   -- it then returns the name bind to the value 
   -- print also returns its argument 
 

```
   do(
      define(x print(5)),
      print(x)
   )
```

   





