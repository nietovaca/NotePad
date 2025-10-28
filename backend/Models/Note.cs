using System.ComponentModel.DataAnnotations;

namespace NotePadApi.Models
{
    //purpose: to store the notes in the database
    //it is used to store the notes in a database
    //it is used to retrieve the notes from the database
    //it is used to add, update, and delete notes from the database

    public class Note
    {
        //id of the note
        public Guid Id { get; set; }
        
        //user id of the note
        public string UserId { get; set; } = string.Empty;
        
        //title of the note
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        //content of the note
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;
        
        //date and time the note was created
        public DateTime CreatedAt { get; set; }
        
        //date and time the note was updated
        public DateTime UpdatedAt { get; set; }
    }
} 