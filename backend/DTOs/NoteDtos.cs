using System.ComponentModel.DataAnnotations;

namespace NotePadApi.DTOs
{
    public class CreateNoteRequest
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;
    }

    public class UpdateNoteRequest
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;
    }

    public class NoteResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
