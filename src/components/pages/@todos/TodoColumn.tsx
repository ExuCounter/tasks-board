import type { ColumnType } from "store/todo_board/types";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Todo } from "components/pages/@todos/Todo";
import { Spinner, Button, Text } from "components/shared/ui-kit/index";
import { removeTodosColumn } from "store/todo_board/reducers/columnsReducer";
import classNames from "classnames";
import { useAppDispatch } from "store";

export const TodoColumn = ({
  title,
  name,
  todos,
  meta,
}: ColumnType & { name: string }) => {
  const isRemovableColumn = meta.policy.removable;
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col w-[100%] bg-gray-100 rounded-md">
      <div
        className="pt-4 px-7 flex justify-between content-center
      min-h-[45px]"
      >
        <Text
          inline
          fontSize="lg"
          className="font-semibold"
        >{`${title} (${todos.length})`}</Text>
        {isRemovableColumn && (
          <div>
            <Button
              onClick={() => dispatch(removeTodosColumn({ title }))}
              variant="danger"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>
      <Droppable droppableId={name}>
        {(provided, snapshot) => {
          const isSameColumn =
            snapshot.draggingOverWith &&
            todos.map((todo) => todo.id).includes(snapshot.draggingOverWith);

          const [isDraggingOver, draggingOverClassNames] = [
            snapshot.isDraggingOver && !isSameColumn,
            "bg-amber-100 bg-opacity-50",
          ];

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classNames(
                "m-2 overflow-y-scroll p-4 transition-all h-[80vh]",
                { [draggingOverClassNames]: isDraggingOver }
              )}
            >
              <Spinner visible={meta.isLoading}>
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
              </Spinner>
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
