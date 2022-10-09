import type { ColumnType } from "store/todo_board/types";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Todo } from "components/pages/@todos/Todo";
import { XCircleIcon } from "@heroicons/react/24/outline";
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
  const isTodoCompletableColumn = meta.policy.todoCompletable;
  const dispatch = useAppDispatch();

  return (
    <div
      className="flex flex-col w-[100%] bg-gray-100 rounded-md
    min-w-[300px]"
    >
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
              <XCircleIcon width={16} height={16} />
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
                          <Todo
                            todo={todo}
                            isDragging={snapshot.isDragging}
                            completable={isTodoCompletableColumn}
                          />
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
