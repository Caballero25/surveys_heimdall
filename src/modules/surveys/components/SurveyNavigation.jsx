import React, { useState } from 'react';
import "../styles/SurveyNavigation.css";
import  {FolderIcon, ChevronDownIcon, CircleIcon } from "../../../mocks/Icons";

const Sidebar = ({ modules = {}, onSubmoduleClick }) => {
  const [openModule, setOpenModule] = useState(null);
  const [activeSubmodule, setActiveSubmodule] = useState(null);

  const handleModuleClick = (moduleName) => {
    setOpenModule(openModule === moduleName ? null : moduleName);
  };

  const handleSubmoduleClick = (moduleName, submoduleName, event) => {
    event.preventDefault();
    setActiveSubmodule(`${moduleName}-${submoduleName}`);
    if (onSubmoduleClick) {
      onSubmoduleClick(moduleName, submoduleName);
    }
  };

  return (
    <nav className="sidebar-nav">
      <h2 className="sidebar-title">Navegación</h2>
      <ul className="modules-list">
        {Object.entries(modules).map(([moduleName, submodules]) => {
          const isOpen = openModule === moduleName;
          const hasSubmodules = submodules && submodules.length > 0;

          return (
            <li key={moduleName} className="module-item">
              <div
                className={`module-header ${isOpen ? 'open' : ''}`}
                onClick={() => hasSubmodules && handleModuleClick(moduleName)}
                role="button"
                tabIndex={0}
              >
                <div className="module-name">
                  <FolderIcon />
                  <span>{moduleName}</span>
                </div>
                {hasSubmodules && (
                  <ChevronDownIcon className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                )}
              </div>
              
              {hasSubmodules && (
                <div className={`submodules-container ${isOpen ? 'open' : ''}`}>
                  <ul className="submodules-list">
                    {submodules.map((submoduleName) => {
                      const isActive = activeSubmodule === `${moduleName}-${submoduleName}`;
                      return (
                        <li key={submoduleName} className="submodule-item">
                          <a
                            href="#"
                            onClick={(e) => handleSubmoduleClick(moduleName, submoduleName, e)}
                            className={isActive ? 'active' : ''}
                          >
                            <CircleIcon className="submodule-icon" />
                            <span>{submoduleName}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;