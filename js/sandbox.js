var createScream = logger => message => logger(message.toUpperCase() + "!!!")

const scream = createScream(message => console.log(message))

scream("hello, friends. Romans. Countrymen.")
