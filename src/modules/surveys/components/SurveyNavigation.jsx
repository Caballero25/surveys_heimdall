import React, { useState } from 'react';

// --- CSS Styles embedded inside the component ---
const sidebarCss = `
  .sidebar-nav {
    background-color: #1e293b;
    border-radius: 12px;
    padding: 1.5rem 1rem;
    border: 1px solid #334155;
    color: #e2e8f0;
    font-family: sans-serif;
  }

  .sidebar-title {
    font-size: 1.25rem;
    color: #f1f5f9;
    margin-top: 0;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    border-bottom: 1px solid #334155;
  }

  .modules-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .module-item {
    margin-bottom: 0.25rem;
  }

  .module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
    background-color: #fe972b;
  }

  .module-header:hover {
    background-color: #334155;
  }

  .module-header.open {
    background-color: #334155;
    color: #f1f5f9;
  }

  .module-name {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .module-name .icon {
    width: 20px;
    height: 20px;
  }

  .chevron-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  .chevron-icon.rotated {
    transform: rotate(180deg);
  }

  .submodules-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;
  }

  .submodules-container.open {
    max-height: 500px;
  }

  .submodules-list {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
    border-left: 2px solid #334155;
    list-style: none;
  }

  .submodule-item a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    color: #94a3b8;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: color 0.2s ease, background-color 0.2s ease;
  }

  .submodule-item a:hover {
    background-color: #334155;
    color: #f1f5f9;
  }

  .submodule-item a.active {
    color: #fe972b;
    font-weight: 600;
  }

  .submodule-icon {
    width: 12px;
    height: 12px;
  }
`;

const SidebarStyles = () => <style>{sidebarCss}</style>;


// --- Icon Components (using inline SVG for simplicity) ---
const FolderIcon = ({ className = "icon" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
  </svg>
);

const ChevronDownIcon = ({ className = "icon" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const CircleIcon = ({ className = "icon" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);


/**
 * A reusable collapsible sidebar navigation component for the dark theme.
 * @param {object} props - The component props.
 * @param {object} props.modules - An object where keys are module names and values are arrays of submodule names.
 * @param {function} props.onSubmoduleClick - A callback function executed when a submodule is clicked.
 */
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
    <>
      <SidebarStyles />
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
    </>
  );
};

export default Sidebar;