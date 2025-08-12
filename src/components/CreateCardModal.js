import React, { useState, useRef } from "react";
import "./CreateCardModal.css";

const CreateCardModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: "",
    comments: [],
    attachments: [],
    history: [],
  });

  const [activeTab, setActiveTab] = useState("comments");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontSize, setFontSize] = useState(3); // 1 a 7
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const editorRef = useRef(null);
  const [savedSelection, setSavedSelection] = useState(null);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#800000",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldLabels = {
      title: "Título",
      description: "Descrição",
      dueDate: "Data de Entrega",
      priority: "Prioridade",
      assignedTo: "Responsável",
    };

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      history: [
        ...prev.history,
        {
          id: Date.now(),
          date: new Date().toISOString(),
          icon: (
            <span role="img" aria-label="Ícone de comentário">
              ✏️
            </span>
          ),
          description: `${fieldLabels[name]} foi alterado${
            name === "priority"
              ? ` para ${
                  value === "low"
                    ? "Baixa"
                    : value === "medium"
                    ? "Média"
                    : "Alta"
                }`
              : ""
          }`,
        },
      ],
    }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
      history: [
        ...prev.history,
        ...files.map((file) => ({
          id: Date.now() + Math.random(),
          date: new Date().toISOString(),
          icon: type === "image" ? "" : "",
          description: `${type === "image" ? "Imagem" : "Documento"} "${
            file.name
          }" foi anexado`,
        })),
      ],
    }));

    // Atualize o estado do componente com o arquivo anexado
    const editorRefCurrent = editorRef.current;
    if (editorRefCurrent) {
      const file = files[0];
      const textNode = document.createTextNode(`[${file.name}]`);
      const anexoElement = document.createElement("span");
      anexoElement.className = "anexo";
      anexoElement.appendChild(textNode);
      editorRefCurrent.appendChild(anexoElement);
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const editorElement = editorRef.current;
      if (
        editorElement &&
        editorElement.contains(range.commonAncestorContainer)
      ) {
        setSavedSelection(range);
      }
    }
  };

  const restoreSelection = () => {
    if (savedSelection && editorRef.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowColorPicker(false);

    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
      document.execCommand("foreColor", false, color);
      setSavedSelection(null);
    }
  };

  const handleAddComment = () => {
    const commentText = document.getElementById("commentText").innerHTML;
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      date: new Date().toISOString(),
      attachments: [],
    };

    setFormData((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
      history: [
        ...prev.history,
        {
          id: Date.now(),
          date: new Date().toISOString(),
          icon: (
            <span role="img" aria-label="Ícone de comentário">
              💬
            </span>
          ),
          description: "Novo comentário adicionado",
        },
      ],
    }));

    document.getElementById("commentText").innerHTML = "";
  };

  const hasChanges = () => {
    return (
      formData.title !== "" ||
      formData.description !== "" ||
      formData.dueDate !== "" ||
      formData.priority !== "medium" ||
      formData.assignedTo !== "" ||
      formData.comments.length > 0 ||
      formData.attachments.length > 0
    );
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignedTo: "",
      comments: [],
      attachments: [],
      history: [],
    });
    setActiveTab("comments");
    setShowColorPicker(false);
    setSelectedColor("#000000");
    setIsBold(false);
    setIsItalic(false);
    setFontSize(3);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleClose = () => {
    if (hasChanges()) {
      if (
        window.confirm("Há alterações não salvas. Deseja realmente fechar?")
      ) {
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Enviar os dados do formulário
    onSubmit(formData);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-card-modal">
        <div className="modal-header">
          <h2>Criar Nova Tarefa</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-card-form">
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva os detalhes da tarefa"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Data de Entrega</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Prioridade</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Responsável</label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Nome do responsável"
            />
          </div>

          <div className="comments-section">
            <div className="comments-tabs">
              <select
                className="comments-select"
                onChange={(e) => setActiveTab(e.target.value)}
                value={activeTab}
              >
                <option value="comments">Comentários</option>
                <option value="history">Histórico</option>
              </select>
            </div>

            <div className="add-comment">
              <div className="comment-editor">
                <div className="comment-editor-header">
                  <div className="format-buttons">
                    <button
                      type="button"
                      className={`format-button ${isBold ? "active" : ""}`}
                      onClick={() => {
                        restoreSelection();
                        document.execCommand("bold", false, null);
                        setIsBold(!isBold);
                      }}
                      title="Negrito"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      className={`format-button ${isItalic ? "active" : ""}`}
                      onClick={() => {
                        restoreSelection();
                        document.execCommand("italic", false, null);
                        setIsItalic(!isItalic);
                      }}
                      title="Itálico"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      className="format-button font-size-button"
                      onClick={() => {
                        restoreSelection();
                        const newSize = fontSize < 7 ? fontSize + 1 : 1;
                        setFontSize(newSize);
                        document.execCommand("fontSize", false, newSize);
                      }}
                      title="Aumentar tamanho da fonte"
                    >
                      A+
                    </button>
                  </div>
                  <div className="color-picker">
                    <button
                      type="button"
                      onClick={() => {
                        restoreSelection();
                        setShowColorPicker(!showColorPicker);
                      }}
                      style={{ color: selectedColor }}
                    >
                      A
                    </button>
                    {showColorPicker && (
                      <div className="color-picker-popup">
                        {colors.map((color) => (
                          <div
                            key={color}
                            className="color-option"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    title="Adicionar imagem"
                  >
                    <span role="img" aria-label="Ícone de imagem">
                      📷
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    title="Adicionar documento"
                  >
                    <span role="img" aria-label="Ícone de documento">
                      📎
                    </span>
                  </button>
                </div>
                <div
                  id="commentText"
                  ref={editorRef}
                  contentEditable
                  style={{ minHeight: "100px", padding: "0.75rem" }}
                  onMouseUp={saveSelection}
                  onKeyUp={saveSelection}
                />
              </div>
              <div className="comment-actions">
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="add-comment-button"
                >
                  Adicionar Comentário
                </button>
              </div>
            </div>

            {activeTab === "comments" && (
              <div className="comments-list">
                {formData.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div dangerouslySetInnerHTML={{ __html: comment.text }} />
                    <small>{new Date(comment.date).toLocaleString()}</small>
                    <button
                      type="button"
                      className="delete-comment"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          comments: prev.comments.filter(
                            (c) => c.id !== comment.id
                          ),
                        }));
                      }}
                    >
                      <span role="img" aria-label="Remover comentário">
                        🗑️
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="history-list">
                {formData.history?.map((event) => (
                  <div key={event.id} className="history-item">
                    <span className="history-icon">{event.icon}</span>
                    <div className="history-content">
                      <div>{event.description}</div>
                      <small>{new Date(event.date).toLocaleString()}</small>
                    </div>
                  </div>
                )) || (
                  <div className="no-history">Nenhuma alteração registrada</div>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "document")}
              multiple
              accept=".pdf,.doc,.docx,.txt"
            />
            <input
              type="file"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "image")}
              multiple
              accept="image/*"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
            >
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCardModal;
