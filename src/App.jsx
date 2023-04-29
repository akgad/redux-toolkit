import {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchTodos } from './store/todoSlice'

import { addNewTodo } from './store/todoSlice';
import NewTodoForm from './components/NewTodoForm';
import TodoList from './components/TodoList';

import './App.css';


function App() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const {status,error} = useSelector(state => state.todos)

  const handleAction = () => {
    if(text.trim().length) {
      dispatch(addNewTodo(text));
      setText('');
    }
  }

  useEffect(() => {
    dispatch(fetchTodos())
  },[dispatch])

  return (
        <div className='App'>
        <NewTodoForm
            value={text}
            updateText={setText}
            handleAction={handleAction}
        />

        {status === "loading" && <h1>Loading...</h1>}
        {error && <h1>Occured an error: {error}</h1>}

        <TodoList />
        </div>
  );
}

export default App;
