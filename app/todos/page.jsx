"use client";




import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Backdrop, OverlayWrapper } from "@/components/tailgrids/core/overlay";



import { Spinner } from "@/components/tailgrids/core/spinner";
import { useEffect, useState } from "react";
import { fetchTodos } from "@/data/Todos";
import { Badge } from "@/components/tailgrids/core/badge";
import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/tailgrids/core/native-select";
import { Button } from "@/components/tailgrids/core/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";
import { Pagination } from "@/components/tailgrids/core/pagination";

import { ClockThree, Check, Trash1, Plus } from "@tailgrids/icons";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [newTodoId, setNewTodoId] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [addTodoError, setAddTodoError] = useState("");
  const [hasLoadedTodos, setHasLoadedTodos] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTodos = async () => {
      await Promise.resolve();

      try {
        if (typeof window === "undefined") {
          return;
        }

        const savedTodos = window.localStorage.getItem("todosRaw");
        let loadedTodos;

        if (savedTodos === null) {
          loadedTodos = await fetchTodos();
        } else {
          loadedTodos = JSON.parse(savedTodos);
          if (
            !Array.isArray(loadedTodos) ||
            !loadedTodos.every(
              (todo) =>
                todo &&
                Number.isSafeInteger(todo.id) &&
                typeof todo.title === "string" &&
                typeof todo.completed === "boolean"
            )
          ) {
            throw new Error("Stored todos data has an invalid format.");
          }
        }

        if (isMounted) {
          setTodos(loadedTodos);
          setLoadError("");
          setHasLoadedTodos(true);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error ? error.message : String(error)
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedTodos || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem("todosRaw", JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage:", error);
    }
  }, [hasLoadedTodos, todos]);

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const makeDone = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  const addTodo = () => {
    const enteredId = newTodoId.trim();
    const id = enteredId
      ? Number(enteredId)
      : todos.reduce((maxId, todo) => Math.max(maxId, todo.id), 0) + 1;
    const title = newTodoTitle.trim();

    if (!Number.isSafeInteger(id) || id < 1) {
      setAddTodoError("ID must be a positive whole number.");
      return false;
    }

    if (todos.some((todo) => todo.id === id)) {
      setAddTodoError("This ID is already in use.");
      return false;
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      { userId: 1, id, title, completed: false },
    ]);
    setNewTodoId("");
    setNewTodoTitle("");
    setAddTodoError("");
    setOnlyWaiting(false);
    setCurrentPage(Math.ceil((todos.length + 1) / itemsPerPage));
    return true;
  };

  const visibleTodos = onlyWaiting
    ? todos.filter((todo) => !todo.completed)
    : todos;
  const totalPages = Math.max(
    1,
    Math.ceil(visibleTodos.length / itemsPerPage)
  );
  const displayedPage = Math.min(currentPage, totalPages);
  const pageTodos = visibleTodos.slice(
    (displayedPage - 1) * itemsPerPage,
    displayedPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (

    <>
    {/* Todo content */}
    <div className="mt-4 px-2 max-w-3xl mx-auto">
      {/* controller */}
      <div className="flex justify-between">
        {/* toggle */}
        <div className="flex items-center">
          <Toggle
            label="Show only waiting"
            checked={onlyWaiting}
            onChange={(event) => {
              setOnlyWaiting(event.target.checked);
              setCurrentPage(1);
            }}
          />
          &nbsp;
          <Button
            size="sm"
            className="h-8 p-2 bg-yellow-500 pointer-events-none"
          >
            Waiting
            <ClockThree />
          </Button>
        </div>

        {/* dropdown */}
        <div className="w-1/5">
        <NativeSelect
            value={itemsPerPage}
            onChange={(event) => {
              setItemsPerPage(Number(event.target.value));
              setCurrentPage(1);
            }}
            aria-label="Items per page"
          >
            <NativeSelectOption value="5"> 5 items per page</NativeSelectOption>
            <NativeSelectOption value="10">
              {" "}
              10 items per page
            </NativeSelectOption>
            <NativeSelectOption value="50">
              {" "}
              50 items per page
            </NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
      {/* table */}
      <div className="mt-1">
        <TableRoot>
          <TableHeader>
            <TableRow className="bg-black text-white">
              <TableHead className="w-24 font-bold text-right">ID</TableHead>
              <TableHead className="font-bold text-center">Title</TableHead>
              <TableHead className="font-bold flex justify-end items-center gap-1">
                <OverlayWrapper>
                  <Button
                    variant="primary"
                    className="h-8 p-2"
                    aria-label="Add todo"
                  >
                    <Plus />
                  </Button>
                  <Backdrop>
                    <Dialog>
                      <DialogHeader>
                        <DialogTitle>Add Todo</DialogTitle>
                        <DialogDescription>
                          Enter an ID and title to add a new todo.
                        </DialogDescription>
                      </DialogHeader>

                      <DialogBody>
                        <form className="flex flex-col gap-4">
                          <label className="flex flex-col gap-1.5">
                            <span>ID</span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={newTodoId}
                              onChange={(event) => {
                                setNewTodoId(event.target.value);
                                setAddTodoError("");
                              }}
                              placeholder="Enter todo ID"
                              className="w-full rounded-lg border border-base-300 px-4 py-2.5"
                              autoFocus
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span>Title</span>
                            <input
                              value={newTodoTitle}
                              onChange={(event) => {
                                setNewTodoTitle(event.target.value);
                                setAddTodoError("");
                              }}
                              placeholder="Enter todo title"
                              className="w-full rounded-lg border border-base-300 px-4 py-2.5"
                            />
                          </label>
                          {addTodoError && (
                            <p role="alert" className="text-sm text-red-600">
                              {addTodoError}
                            </p>
                          )}
                        </form>
                      </DialogBody>

                      <DialogFooter>
                        <DialogClose appearance="outline">Cancel</DialogClose>
                        <DialogClose
                          onPress={(event) => {
                            if (!addTodo()) {
                              event.preventDefault();
                            }
                          }}
                        >
                          Add Todo
                        </DialogClose>
                      </DialogFooter>
                    </Dialog>
                  </Backdrop>
                </OverlayWrapper>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* spiner show */}

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && loadError && (
              <TableRow>
                <TableCell colSpan={3} role="alert" className="text-center text-red-500">
                  Could not load todos: {loadError}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !loadError && visibleTodos.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-500">
                  No todos found.
                </TableCell>
              </TableRow>
            )}

            {/* reder data */}
            {!isLoading && !loadError && pageTodos.map((todo) => {
              return (
                <TableRow key={todo.id}>
                  <TableCell className="text-right">
                    <Badge
                      size={"lg"}
                      className="rounded-lg bg-gray-500 text-white font-bold"
                    >
                      {todo.id}
                    </Badge>
                  </TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell className="flex justify-end gap-1">
                    {todo.completed ? (
                      <>
                        <Button
                          size="sm"
                          className="pointer-events-none h-8 bg-green-700 text-white"
                        >
                          Done
                          <Check />
                        </Button>
                        <Button variant="danger" className="h-8 p-2">
                          <Trash1 />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
              size='sm'
              className='h-8 bg-yellow-500 hover:bg-yellow-700 hover:text-yellow-200 p-2'
              onClick={() => makeDone(todo.id)}
            >
                          Waiting
                          <ClockThree />
                        </Button>
                       <Button variant='danger' className='h-8 p-2'
              onClick={() => deleteTodo(todo.id)}>
              <Trash1 />
            </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {/* fls */}
            {/* <TableRow>
              <TableCell className="text-right">
                <Badge
                  size={"lg"}
                  className="rounded-lg bg-gray-500 text-white font-bold"
                >
                  12
                </Badge>
              </TableCell>
              <TableCell>Lorem ipsum dolor.</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button
                  size="sm"
                  className="h-8 bg-yellow-500 hover:bg-yellow-700 hover:text-yellow-200 p-2"
                >
                  Waiting
                  <ClockThree />
                </Button>
                <Button variant="danger" className="h-8 p-2">
                  <Trash1 />
                </Button>
              </TableCell>
            </TableRow> */}

            {/* compls true */}
            {/* <TableRow>
              <TableCell className="text-right">
                <Badge
                  size={"lg"}
                  className="rounded-lg bg-gray-500 text-white font-bold"
                >
                  1234
                </Badge>
              </TableCell>
              <TableCell>Lorem ipsum dolor.</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button
                  size="sm"
                  className="h-8 bg-green-700 text-white pointer-events-none"
                >
                  Done
                  <Check />
                </Button>
                <Button variant="danger" className="h-8 p-2">
                  <Trash1 />
                </Button>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </TableRoot>
      </div>
      {/* pagination */}

      <div>
        {/* pagination */}

        {!isLoading && !loadError && visibleTodos.length > 0 && (
          <div className="mt-1 w-1/3 mx-auto flex justify-center items-center gap-1">
            <Button
              size="sm"
              appearance="outline"
              onClick={() => handlePageChange(1)}
              disabled={displayedPage === 1}
            >
              First
            </Button>
            <div>
              <Pagination
                currentPage={displayedPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                sideLayout="icon"
              />
            </div>
            <Button
              size="sm"
              appearance="outline"
              onClick={() => handlePageChange(totalPages)}
              disabled={displayedPage === totalPages}
            >
              Last
            </Button>
          </div>
        )}
      </div>
    </div>

      </>
  );
  
}
