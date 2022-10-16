//setting or storing data to localStorage
localStorage.setItem('name', 'samim')
localStorage.setItem('age', 30)

//Removing data from localStorage
localStorage.removeItem('name')
localStorage.removeItem('age')

//Getting data from localStorage
localStorage.getItem('name') // 'samim'
localStorage.getItem('age') // "30"

const userObj = {
  name: 'samim',
}

//object
localStorage.setItem('user', JSON.stringify(userObj))
const strData = localStorage.getItem('user') //results string
const userData = JSON.parse(strData)
