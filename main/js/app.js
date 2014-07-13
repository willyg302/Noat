capitalize = function(s) {
	return s[0].toUpperCase() + s.slice(1);
};
setEditModal = function(title, content, type, id) {
	$("#noteTitle").val(title);
	$("#summernote").code(content);
	$("#noteType").val(capitalize(type));
	$("#noteID").val(id);
	$('#editNote').modal('show');
};
addNote = function() {
	setEditModal("", "", "default", "");
};
updateNote = function(id) {
	note = $("#" + id);
	setEditModal(note.find(".note-title").html(), note.find(".panel-body").html(), note.find(".note-type").html(), id);
};
deleteNote = function(id) {
	$.post("/dnote", {
		k: id,
		n: "{{ author_name }}",
		p: "{{ author_pass }}"
	}, function(data) {
		//
	});
};