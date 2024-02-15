import { useState, useEffect, useRef } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import "./Sectors.css";
import { useSelector } from "react-redux";

const DropdownCheckbox = ({
  errors,
  touched,
  isEditing,
  arrayHelpers,
  selectedSectors,
  setSelectedSectors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSelector((state) => state.sectors);
  const sectors = data.sectors;

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSectorChange = (sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  useEffect(() => {
    arrayHelpers.form.setFieldValue("sectors", selectedSectors);
  }, [selectedSectors]);

  const getName = (sectorArray, sectorId) => {
    for (let sector of sectorArray) {
      if (sector.sectorid == sectorId) {
        return sector.name;
      }
      if (sector.children) {
        const childName = getName(sector.children, sectorId);
        if (childName) return childName;
      }
    }
  };

  const getSectorName = (sectorId) => {
    let currentSectors = sectors;
    while (currentSectors) {
      const name = getName(currentSectors, sectorId);
      if (name) return name;
      currentSectors = currentSectors.children;
    }
  };

  return (
    <div
      id="sectors"
      name="sectors"
      onClick={toggleDropdown}
      ref={dropdownRef}
      className={`relative inline-block mt-2 p-2 w-full rounded shadow-inner ${
        errors.sectors && touched.sectors ? "border-red-500 border-2" : "border"
      }`}
    >
      <div className="flex justify-between">
        <div
          className={`inline me-2 w-56 md:w-full ${
            isEditing || selectedSectors.length !== 0
              ? "text-black"
              : "text-gray-400"
          } overflow-hidden overflow-ellipsis whitespace-nowrap`}
        >
          {isEditing || selectedSectors.length !== 0
            ? selectedSectors.map((sector) => getSectorName(sector)).join(", ")
            : "Current Sectors"}
        </div>
        <div className="inline me-2">
          {isOpen ? (
            <FaAngleUp className="inline" />
          ) : (
            <FaAngleDown className="inline" />
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className="dropdown-menu m-2 w-full overflow-auto max-h-64"
          onClick={(e) => e.stopPropagation()}
        >
          {sectors.map((sector) => (
            <div key={sector.sectorid}>
              <label className="block text-black">
                <input
                  type="checkbox"
                  id={sector.sectorid}
                  checked={selectedSectors.includes(sector.sectorid)}
                  onChange={() => handleSectorChange(sector.sectorid)}
                  className="mx-2 h-3 w-3 rounded shadow-inner"
                />
                {sector.name}
              </label>
              {sector.children &&
                sector.children.map((child) => (
                  <div key={child.sectorid} className="ml-4 c">
                    <label className="block text-black">
                      <input
                        type="checkbox"
                        id={child.sectorid}
                        checked={selectedSectors.includes(child.sectorid)}
                        onChange={() => handleSectorChange(child.sectorid)}
                        className="mx-2 h-3 w-3 rounded shadow-inner"
                      />
                      {child.name}
                    </label>
                    {child.children &&
                      child.children.map((grandChild) => (
                        <div key={grandChild.sectorid} className="ml-4 gc">
                          <label className="block text-black">
                            <input
                              type="checkbox"
                              id={grandChild.sectorid}
                              checked={selectedSectors.includes(
                                grandChild.sectorid
                              )}
                              onChange={() =>
                                handleSectorChange(grandChild.sectorid)
                              }
                              className="mx-2 h-3 w-3 rounded shadow-inner"
                            />
                            {grandChild.name}
                            {grandChild.children &&
                              grandChild.children.map((greatGrandChild) => (
                                <div
                                  key={greatGrandChild.sectorid}
                                  className="ml-4 ggc"
                                >
                                  <label className="block text-black">
                                    <input
                                      type="checkbox"
                                      id={greatGrandChild.sectorid}
                                      checked={selectedSectors.includes(
                                        greatGrandChild.sectorid
                                      )}
                                      onChange={() =>
                                        handleSectorChange(
                                          greatGrandChild.sectorid
                                        )
                                      }
                                      className="mx-2 h-3 w-3 rounded shadow-inner"
                                    />
                                    {greatGrandChild.name}
                                  </label>
                                </div>
                              ))}
                          </label>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;
