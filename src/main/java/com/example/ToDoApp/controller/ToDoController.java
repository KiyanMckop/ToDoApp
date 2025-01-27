package com.example.ToDoApp.controller;


import com.example.ToDoApp.model.ToDo;
import com.example.ToDoApp.repository.ToDoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo")
public class ToDoController {

    @Autowired
    private ToDoRepository toDoRepository;

    // create to_do item
    @PostMapping
    public ToDo createToDo(@RequestBody ToDo toDo){
        return toDoRepository.save(toDo);
    }

    // read all to_do items
    @GetMapping
    public List<ToDo> getAllTodos(){
        return toDoRepository.findAll();
    }

    // get to_do item by id
    @GetMapping("/{id}")
    public ToDo getToDoById(@PathVariable Long id){
        return toDoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ToDo item not found"));
    }

    // update to_do item by id
    @PutMapping("/{id}")
    public ToDo updateToDo(@PathVariable Long id, @RequestBody ToDo updatedToDo) {
        ToDo oldToDo = toDoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ToDo item not found"));
        oldToDo.setTitle(updatedToDo.getTitle());
        oldToDo.setDescription(updatedToDo.getDescription());
        oldToDo.setDueDate(updatedToDo.getDueDate());
        oldToDo.setPriority(updatedToDo.getPriority());
        oldToDo.setCompleted(updatedToDo.isCompleted());
        return toDoRepository.save(oldToDo);
    }


    //delete to_do item by id
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Long id){
        toDoRepository.deleteById(id);
        return "ToDo item deleted";
    }

    //update isCompleted
    @PutMapping("/{id}/complete")
    public ToDo updateIsComplete(@PathVariable Long id) {
        ToDo todo = toDoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ToDo item not found"));
        todo.setCompleted(!todo.isCompleted());  // Toggle completion status
        return toDoRepository.save(todo);
    }




}
