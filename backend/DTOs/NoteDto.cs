using System.ComponentModel.DataAnnotations;

namespace NotePadApi.DTOs
{
    //this class is used to transfer data between the controller and the service layer
    //it is used to validate the data received from the controller
    //it is used to transfer the data to the service layer, repository layer, and view layer

    public class NoteDto
    {
        public Guid? Id { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;
        
        public DateTime? CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
    }
}
