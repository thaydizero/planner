import React, { useState } from "react";
import "./ServicosBoard.css";
import CreateCardModal from "./CreateCardModal";

const ServicosBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [columns, setColumns] = useState({
    "esperando-inicio": {
      title: "Esperando Início",
      items: [],
    },
    "em-producao": {
      title: "Em Produção",
      items: [
        {
          id: "1",
          identifier: "PROT-001",
          title: "Prótese Lucas",
          dateInicio: new Date().toISOString(),
          priority: "high",
          daysOpen: 0,
        },
      ],
    },
    "em-transporte": {
      title: "Em Transporte",
      items: [],
    },
    finalizado: {
      title: "Finalizado",
      items: [],
    },
  });

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  const calculateDaysOpen = (dateInicio) => {
    const start = new Date(dateInicio);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDragStart = (e, id, sourceColumnId) => {
    e.dataTransfer.setData("cardId", id);
    e.dataTransfer.setData("sourceColumnId", sourceColumnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderCard = (item, columnId) => (
    <div
      key={item.id}
      className={`card priority-${item.priority}`}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, item.id, columnId)}
      onClick={() => handleCardClick(item)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-identifier">{item.identifier}</div>
      <h4>{item.title}</h4>
      <div className="card-info">
        <span role="img" aria-label="Ícone de comentário" className="card-date">
          📅 {new Date(item.dateInicio).toLocaleDateString()}
        </span>
        <span role="img" aria-label="Ícone de comentário" className="card-days">
          ⏳ {calculateDaysOpen(item.dateInicio)} dias
        </span>
        <span
          role="img"
          aria-label="Ícone de comentário"
          className={`priority-badge ${item.priority}`}
        >
          {item.priority === "high"
            ? "🔴"
            : item.priority === "medium"
            ? "🟡"
            : "🟢"}
        </span>
      </div>
    </div>
  );

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (sourceColumnId === targetColumnId) return;

    setColumns((prev) => {
      const sourceColumn = prev[sourceColumnId];
      const destColumn = prev[targetColumnId];
      const cardToMove = sourceColumn.items.find((item) => item.id === cardId);

      if (!cardToMove) return prev;

      return {
        ...prev,
        [sourceColumnId]: {
          ...sourceColumn,
          items: sourceColumn.items.filter((item) => item.id !== cardId),
        },
        [targetColumnId]: {
          ...destColumn,
          items: [...destColumn.items, cardToMove],
        },
      };
    });
  };

  const handleCreateService = () => {
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleAddService = (newService) => {
    if (selectedCard) {
      // Update existing card
      setColumns((prev) => {
        const updatedColumns = { ...prev };
        Object.keys(updatedColumns).forEach((columnId) => {
          updatedColumns[columnId].items = updatedColumns[columnId].items.map(
            (item) =>
              item.id === selectedCard.id ? { ...item, ...newService } : item
          );
        });
        return updatedColumns;
      });
    } else {
      // Create new card
      setColumns((prev) => {
        // Encontrar o último número de identificador usado
        const lastId = Math.max(
          0,
          ...Object.values(prev)
            .flatMap((column) => column.items)
            .map((item) => {
              const num = item.identifier
                ? parseInt(item.identifier.split("-")[1])
                : 0;
              return isNaN(num) ? 0 : num;
            })
        );

        // Criar novo identificador
        const newId = (lastId + 1).toString().padStart(3, "0");

        const serviceData = {
          ...newService,
          id: Date.now().toString(),
          identifier: `PROT-${newId}`,
          dateInicio: new Date().toISOString(),
        };

        // Retornar o novo estado
        return {
          ...prev,
          "esperando-inicio": {
            ...prev["esperando-inicio"],
            items: [...prev["esperando-inicio"].items, serviceData],
          },
        };
      });

      // A atualização do estado já foi feita acima
    }
    setIsModalOpen(false);
  };

  return (
    <div className="servicos-container">
      <div className="servicos-header">
        <h2>Quadro</h2>
        <button onClick={handleCreateService} className="new-service-button">
          Novo Serviço
        </button>
      </div>
      <div className="board">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className="column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnId)}
          >
            <h3>{column.title}</h3>
            <div className="dropzone">
              {column.items.map((item) => renderCard(item, columnId))}
            </div>
          </div>
        ))}
      </div>
      <CreateCardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddService}
        initialData={selectedCard}
        isEditing={!!selectedCard}
      />
    </div>
  );
};

export default ServicosBoard;
