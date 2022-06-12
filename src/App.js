import React from 'react';
import './App.css';

const ListItem = ({item}) => {
  return (
      <div style={{
        backgroundColor: item.active ? 'rgb(58, 113, 29)' : !item.done ? 'rgb(221, 242, 210)' : "#DDD", 
        margin: 10, 
        padding: 10,
        fontSize: 22,
        borderRadius: 10,
        color: item.active ? "#FFF" : !item.done ? "#000" : "#888",     
      }}>
          {item.text}
      </div>
  )
}


function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const urlList = queryParams.get("n");

  const [text, setText] = React.useState("")
  const [list, setList] = React.useState([])
  const [validList, setValidList] = React.useState([])
  const [index, setIndex] = React.useState(null)

  React.useEffect(() => {
    //getFrom local storage    
    if(urlList && urlList !== ""){
      let x = urlList.replaceAll('-',"\n")
      getList(x)  
      return
    }
    let storageX = localStorage.getItem('@randomizer-text')
    if(storageX) {
      getList(storageX)
    }    
  }, [urlList])

  React.useEffect(() => {
    localStorage.setItem('@randomizer-text', text)
  }, [text])

  function getList(stringList){
    setText(stringList)    
    if(stringList === "") {
      setList([])
      setValidList([])
      return
    }
    let newList = stringList.split('\n')?.map((item, i) => {
      return {id: i, text: item, done: false, active: false}
    })
    setList(newList)
    setValidList(newList)
  }

  function randmoizer(){
    let newValidList = [...validList]    
    let newList = [...list]

    if(index !== null && index !== undefined){        
      let itemI = newValidList[index]
      if(!itemI) return
      newValidList.splice(index,1)      
      newList[itemI.id].done = true;
      newList[itemI.id].active = false;
      setValidList(newValidList)
    }

    let counter = 0;
    let interval = setInterval(() => {
      newList.forEach(item => {
        item.active = false
      })
      if(counter >= 9){
        clearInterval(interval)
        return
      }
      newList = activeARandomItem(newValidList)
      setList(newList)
      counter++;
    }, 100)    
  }

  function activeARandomItem(validList){
    let newList = [...list]
    let x = Math.floor(Math.random() * validList.length)
    let item = validList[x]
    if(item){
      newList[item.id].active = true;
      setIndex(x)
    }
    return newList;
  }

  return (
    <div className="App" style={{justifyContent: 'center', display: 'flex'}}>
      <div style={{paddingTop: 30, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', width: '90%'}}>
        <div style={styles.inputdiv}>
        <p style={{alignSelf: 'flex-start'}}>Add names:</p>
          <textarea value={text} style={styles.textArea} onChange={(e) => {getList(e.target.value)}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', flexFlow: 'column wrap'}}>
          <button style={styles.btn} onClick={randmoizer}>Next</button>
          <button style={styles.btn} onClick={() => {
            setIndex()
            getList(text)
          }}>Reset</button>
          <button style={styles.btn} onClick={() => {
            setIndex(null)
            setText("")
            getList("")
          }}>Clear</button>
        </div>
        <div style={styles.resdiv}>
          <p style={{alignSelf: 'flex-start'}}>Who is next?</p>
          <div style={styles.listItems}>        {list && list.length > 0 &&
                list.map((item, i) => {
                    return <ListItem key={i} item={item}/>
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  randomizerBtn: {
    backgroundColor: "#F00",
    border: 0,
    padding: 10,
  },
  errorMessage: {
    color: "#F00",
  },
  resdiv:{
    flex: 1,
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',    
    padding: 10,
    minWidth: 200,
  },
  listItems: {    
    maring: 10,
    padding: 10,
    flex: 1,
    borderRadius: 10,
    borderColor: '#000',
    border: 'solid',
    borderWidth: 1,
  },
  inputdiv: {    
    flex: 1,
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    minWidth: 200,
  },
  textArea: {      
      flex: 1,
      resize: 'none',
      fontSize: 18,
      padding: 10,
      backgroundColor: '#EEE',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#353535",
  },
  btn: {
    backgroundColor: '#4b824e',
    borderRadius: 10,
    borderWidth: 4,
    margin: 10,
    borderColor: "#4b824e",
    alignItems: 'center',
    justifyContent: 'center',
    color:  "#FFF",
    fontSize: 26,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
  }

}

export default App;
