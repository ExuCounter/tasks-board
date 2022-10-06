import type { ColumnType } from "store/todos/types";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Todo } from "components/pages/@todos/Todo";
import classNames from "classnames";

export const TodoColumn = ({
  title,
  type,
  todos,
}: ColumnType & { type: string }) => {
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
