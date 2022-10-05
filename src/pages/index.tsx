import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "store/index";
import { removeAllTodos, selectTodos } from "store/todos/slice";
import type { ColumnType } from "store/todos/types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "components/shared/ui-kit/index";
import { todosApi } from "store/todos/api";
import classNames from "classnames";
import { TodoType } from "store/todos/types";
import { CreateColumnForm } from "components/pages/@todos/forms/CreateColumnForm";
import { CreateTodoForm } from "components/pages/@todos/forms/CreateTodoForm";
import { bulkAddTodos, removeTodo, todoDragEnd } from "store/todos/slice";

const Todo = ({
  todo,
  isDragging,
}: {
  todo: TodoType;
  isDragging: boolean;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className={classNames(
        "flex justify-between items-center mb-4 bg-white transition-colors",
        { "bg-cyan-50": isDragging }
      )}
    >
      <div className="px-3">{todo.todo}</div>
      <Button onClick={() => dispatch(removeTodo({ id: todo.id }))}>
        Remove
      </Button>
    </div>
  );
};

const TodoColumn = ({ title, type, todos }: ColumnType & { type: string }) => {
  return (
    <div className="flex flex-col w-[100%] bg-gray-100">
      <div className="py-4 px-4">{`${title} (${todos.length})`}</div>
      <Droppable droppableId={type}>
        {(provided, snapshot) => {
          const isSameColumn =
            snapshot.draggingOverWith &&
            todos.map((todo) => todo.id).includes(snapshot.draggingOverWith);

          const isDraggingOver = snapshot.isDraggingOver && !isSameColumn;

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classNames(
                "m-2 overflow-y-scroll p-4 transition-all h-[80vh]",
                {
                  "bg-fuchsia-50": isDraggingOver,
                }
              )}
            >
              {todos.map((todo, idx) => (
                <Draggable draggableId={todo.id} key={todo.id} index={idx}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        key={todo.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Todo todo={todo} isDragging={snapshot.isDragging} />
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

const Root: NextPage = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  const fetchTodos = async () => {
    const { data } = await dispatch(todosApi.endpoints.getTodos.initiate(null));

    if (data) {
      dispatch(bulkAddTodos(data));
    }
  };

  return (
    <div className="px-8 text-xl">
      <div className="flex items-start justify-between my-5">
        <div className="flex gap-4">
          <CreateTodoForm />
          <CreateColumnForm />
        </div>
        <div className="flex">
          <Button onClick={() => fetchTodos()} className="mr-5">
            Fetch random todos
          </Button>
          <Button onClick={() => dispatch(removeAllTodos())}>
            Remove all todos
          </Button>
        </div>
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          if (result.destination) {
            dispatch(
              todoDragEnd({
                id: result.draggableId,
                destination: result.destination,
                source: result.source,
              })
            );
          }
        }}
      >
        <div className="flex gap-4 mt-4">
          {Object.keys(todos).map((type, idx) => (
            <TodoColumn {...todos[type]} type={type} key={idx} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Root;
