import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async function(_,{rejectWithValue}){
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')

            if(!res.ok) {
                throw new Error('Server Error!')
            }

            const data = await res.json()

            return data
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.message)
        }
    }
)

export const fetchDelete = createAsyncThunk(
    'todos/fetchDelete',
    async function(id,{rejectWithValue,dispatch}) {
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`,{
                method: 'DELETE'
            })

            if(!res.ok) {
                throw new Error('Server Error!')
            }

            dispatch(removeTodo({id}))
        } catch (error) {
            rejectWithValue(error.message)
        }
    }
)

export const toggleCompleteCheckbox = createAsyncThunk(
    'todos/toggleCompleteCheckbox',
    async function(id,{rejectWithValue,getState,dispatch}) {
        const todo = getState().todos.todos.find(item => item.id === id)

        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`,{
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        completed: !todo.completed
                    })
                })

            if(!res.ok) {
                throw new Error('Toggle Error')
            }

            dispatch(toggleComplete({id}))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addNewTodo = createAsyncThunk(
    'todos/addNewTodo',
    async function(text,{rejectWithValue,dispatch}) {
        try {
            const todo = {
                userId: 1,
                title: text,
                completed: false
            }
            
            const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            })

            if(!res.ok) {
                throw new Error('Add New Todo Error')
            }

            const data = await res.json()
            console.log(data)
            dispatch(addTodo(data))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const setError = (state,action) => {
    state.status = 'rejected'
    state.error = action.payload
}

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null,
    },
    reducers: {
        addTodo(state, action) {
            state.todos.push(action.payload);
        },
        toggleComplete(state, action) {
            const toggledTodo = state.todos.find(todo => todo.id === action.payload.id);
            toggledTodo.completed = !toggledTodo.completed;
        },
        removeTodo(state, action) {
            state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
        }
    },
    extraReducers: {
        [fetchTodos.pending]: (state,action) => {
            state.status = 'loading'
            state.error = null
        },
        [fetchTodos.fulfilled]: (state,action) => {
            state.status = 'resolved'
            state.todos = action.payload
        },
        [fetchTodos.rejected]: setError,
        [fetchDelete.rejected]: setError,
        [toggleCompleteCheckbox.rejected]: setError,
        [addNewTodo.rejected]: setError,

    }
});

export const {addTodo, toggleComplete, removeTodo} = todoSlice.actions;

export default todoSlice.reducer;