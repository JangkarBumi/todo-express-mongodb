import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addTodo, getTodos } from '../actions/todo';
import { TodoItem } from './TodoItem';

const Todo = ({ todos, getTodos, loading, addTodo }) => {
  useEffect(() => {
    getTodos();
  }, [getTodos]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
  });

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { title, date } = formData;

  const handleSubmit = e => {
    e.preventDefault();

    console.log(formData);
    addTodo(formData);
  };

  if (loading) {
    return (
      <Fragment>
        <p>Loading ...</p>
      </Fragment>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" id="titleLabel">
          <input
            type="text"
            name="title"
            id="title"
            onChange={e => onChange(e)}
            value={title}
            placeholder="Enter a task"
            required
          />
        </label>
        <label htmlFor="date" id="dateLabel">
          <input
            type="text"
            name="date"
            id="date"
            onChange={e => onChange(e)}
            value={date}
            placeholder="Enter deadline!"
            required
          />
        </label>
        <button type="submit">Add Task</button>
      </form>
      <TodoItem key={12} title={"test"} date={"test"} />
      {todos.map(todo => (
        <TodoItem key={todo.id} title={todo.title} date={todo.date} />
      ))}
    </div>
  );
};
Todo.propTypes = {
  getTodos: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  todos: state.todos.todos,
  loading: state.todos.loading,
});

export default connect(mapStateToProps, { getTodos, addTodo })(Todo);
