import { useDispatch } from 'react-redux';
import {toggleCompleteCheckbox} from '../store/todoSlice';

import { fetchDelete } from '../store/todoSlice'

const TodoItem = ({ id, title, completed }) => {
  const dispatch = useDispatch();

  return (
    <li>
      <input
        type='checkbox'
        checked={completed}
        onChange={() => dispatch(toggleCompleteCheckbox(id))}
      />
      <span>{title}</span>
      <span onClick={() => dispatch(fetchDelete(id))}>&times;</span>
    </li>
  );
};

export default TodoItem;
