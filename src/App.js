import React, { useRef, useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

import calendarIcon from "./assets/calendar-icon.png";
import settingsIcon from "./assets/settings-icon.svg";
import folderIcon from "./assets/folder-icon.png";
import userIcon from "./assets/user-icon.png";
import Search from "./assets/search.png"
import Mic from './assets/mic.png';
import IOS_Share from "./assets/ios_share.png"
import Arrow from './assets/arrow.png';
import Bell from './assets/bell.png'
import Count from './assets/count.png'
import Five from './assets/5.png';
import Circle from './assets/circle.png';
import Person from './assets/person.png';
import Logo from './assets/logo.png'

const ItemTypes = {
  TEMPLATE: "template",
};

const templatesList = [
  "Subjective",
  "Objective",
  "Assessment & Plan",
  "Findings",
  "Diagnoses",
  "Treatment",
  "Recovery",
];

const TemplateCard = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TEMPLATE,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="template-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {name}
    </div>
  );
};

const ScrollableTemplateList = ({ templates }) => {
  const containerRef = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.TEMPLATE,
    hover(_, monitor) {
      const offset = monitor.getClientOffset();
      const container = containerRef.current;
      if (!container || !offset) return;

      const { top, bottom } = container.getBoundingClientRect();
      const scrollThreshold = 50;
      const scrollSpeed = 10;

      if (offset.y > bottom - scrollThreshold) {
        container.scrollBy({ top: scrollSpeed, behavior: "smooth" });
      } else if (offset.y < top + scrollThreshold) {
        container.scrollBy({ top: -scrollSpeed, behavior: "smooth" });
      }
    },
  });

  return (
    <div
      ref={(node) => {
        drop(node);
        containerRef.current = node;
      }}
      className="template-list"
    >
      <div className="template-search">
        Search template
        <img src={Search} alt="Search" />
      </div>
      {templates.map((template) => (
        <TemplateCard key={template} name={template} />
      ))}
    </div>
  );
};

const TemplateDropZone = ({ droppedItems, onDropItem }) => {
  const containerRef = useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.TEMPLATE,
    drop: (item) => onDropItem(item.name),
    hover(_, monitor) {
      const offset = monitor.getClientOffset();
      const container = containerRef.current;
      if (!container || !offset) return;
      const { bottom, top } = container.getBoundingClientRect();
      const scrollThreshold = 50;
      const scrollSpeed = 5;

      if (offset.y > bottom - scrollThreshold) {
        container.scrollBy({ top: scrollSpeed, behavior: "smooth" });
      } else if (offset.y < top + scrollThreshold) {
        container.scrollBy({ top: -scrollSpeed, behavior: "smooth" });
      }
    },
  });

  return (
    <div
      ref={(node) => {
        drop(node);
        containerRef.current = node;
      }}
      className="drop-zone"
    >
      {droppedItems.map((item, index) => (
        <div key={index} className="template-card dropped">
          <strong>{item}:</strong>
          <div className="template-content">[Add content here]</div>
        </div>
      ))}
    </div>
  );
};




const App = () => {
  const [droppedTemplates, setDroppedTemplates] = useState([]);

  // useEffect(() => {
  //   const handleDragStart = () => {
  //     document.body.classList.add('no-scroll');
  //   };
  
  //   const handleDragEnd = () => {
  //     document.body.classList.remove('no-scroll');
  //   };
  
  //   window.addEventListener('dragstart', handleDragStart);
  //   window.addEventListener('dragend', handleDragEnd);
  
  //   return () => {
  //     window.removeEventListener('dragstart', handleDragStart);
  //     window.removeEventListener('dragend', handleDragEnd);
  //   };
  // }, []);
  

  const handleDropItem = (itemName) => {
    setDroppedTemplates((prev) => [...prev, itemName]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
      <header className="app-header">
        <div style={{display:'flex'}}>
        <img src={Logo} alt="Logo"  />
  <h1 style={{marginLeft: '5px'}}>Othisis Medtech</h1>
        </div>
  <div style={{display: 'flex', alignItems: 'center', paddingRight: '40px'}}>
    <div style={{position: 'relative'}} >
      <img src={Bell} alt="Bell" />
      <img src={Count} alt="count" style={{position: 'absolute', top: '-5px', right: '-5px'}} />
      <img src={Five} alt="Five" style={{position: 'absolute', top: '0', left: '15px'}} />
    </div>
    <div style={{marginLeft: '20px', marginRight: '20px'}}>
      <img src={Person} alt="person" />
    </div>
    <div>
    <img src={Circle} alt="circle" />
    </div>
       </div>
</header>
        <aside className="sidebar">
          <div className="sidebar-icons">
          
          <img src={Arrow} alt="Arrow" className="icon" />
            <img src={calendarIcon} alt="Calendar" className="icon" />
            <img src={settingsIcon} alt="Settings" className="icon" />
            <img src={folderIcon} alt="Folder" className="icon" />
            <img src={userIcon} alt="User" className="icon" />
          </div>
        </aside>

        <div className="main-content dark-theme">
          <aside className="template-sidebar">
            <h2 className="sidebar-title">Template</h2>
            <ScrollableTemplateList templates={templatesList} />
          </aside>

          <main className="editor-container">
            <header className="editor-header">
              <h2>Root Canal</h2>
              <div>
                <button className="resume-btn">
                  <img src={Mic} alt="Mic" />
                  Resume</button>
                  <button className="ios-share-btn"><img src={IOS_Share} alt="" /></button>
                <button className="delete-btn">🗑️</button>
              </div>
            </header>
            <TemplateDropZone
              droppedItems={droppedTemplates}
              onDropItem={handleDropItem}
            />
            <footer className="editor-footer">
              <button className="referral-btn">Send Referral</button>
              <button className="save-btn">Save Note</button>
            </footer>
          </main>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
