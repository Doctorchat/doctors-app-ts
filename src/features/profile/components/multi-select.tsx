import { cx } from "class-variance-authority";
import React, { useEffect } from "react";
import { useMultipleSelection, useCombobox } from "downshift";
import { Input } from "@/components/ui";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";

interface Item {
  id: number;
  name_en: string;
  name_ro: string;
  name_ru: string;
}
export const MultiSelect = (props: any) => {
  const { t } = useTranslation();
  const sessionUser = localStorage.getItem("session:user") ?? "";
  const user = sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";

  let initialSelectedItems: Item[];

  const storeCategories = localStorage.getItem("user:category");

  useEffect(() => {
    localStorage.setItem("user:category", JSON.stringify(user.category.map((itm: Item) => itm.id)));
  }, []);

  const initialItems = () => {
    if (storeCategories) {
      const storeData = props.data.filter(
        (itm: Item) => JSON.parse(storeCategories).includes(itm.id.toString()) && itm
      );
      const items = [
        ...user.category,
        ...storeData.filter((item: Item) => !user.category.includes(item)),
      ];

      const data = items.filter((n, i) => items.findIndex((e) => e.id === n.id) === i);

      return (initialSelectedItems = data);
    }
    return (initialSelectedItems = user.category);
  };

  function getFilteredItems(selectedItems: Item[], inputValue: string) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return props.data.filter(function filterItem(item: any) {
      return (
        !selectedItems.includes(item) &&
        item[`name_${i18n.language}`].toLowerCase().includes(lowerCasedInputValue)
      );
    });
  }

  const updateStore = (item: Item) => {
    const storeItems = localStorage.getItem("user:category");
    if (storeItems) {
      const items = [...JSON.parse(storeItems), item.id].map((n: number) => n.toString());
      localStorage.setItem("user:category", JSON.stringify(items));
      props.onChange(items);
    }
  };

  function MultipleComboBox() {
    const [inputValue, setInputValue] = React.useState("");
    const [selectedItems, setSelectedItems] = React.useState(initialItems());
    const items = React.useMemo(
      () => getFilteredItems(selectedItems, inputValue),
      [selectedItems, inputValue]
    );

    const removeItems = (item: Item) => {
      const storeItems = localStorage.getItem("user:category");
      if (storeItems) {
        const items = JSON.parse(storeItems).filter((n: string) => n != item.id.toString());
        localStorage.setItem("user:category", JSON.stringify(items));
        return removeSelectedItem(item);
      }
    };
    const { getSelectedItemProps, getDropdownProps, removeSelectedItem } = useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems!);
            break;
          default:
            break;
        }
      },
    });
    const {
      isOpen,
      getToggleButtonProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      selectedItem,
    } = useCombobox({
      items,
      itemToString(item) {
        return item ? item[`name_${i18n.language}`] : "";
      },
      defaultHighlightedIndex: 0, // after selection, highlight the first item.
      selectedItem: null,
      inputValue,
      stateReducer(state, actionAndChanges) {
        const { changes, type } = actionAndChanges;

        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            return {
              ...changes,
              isOpen: true, // keep the menu open after selection.
              highlightedIndex: 0, // with the first option highlighted.
            };
          default:
            return changes;
        }
      },
      onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            if (newSelectedItem) {
              setSelectedItems([...selectedItems, newSelectedItem]);
              updateStore(newSelectedItem);

              setInputValue("");
            }
            break;

          case useCombobox.stateChangeTypes.InputChange:
            setInputValue(newInputValue!);

            break;
          default:
            break;
        }
      },
    });

    return (
      <div>
        <div className="flex flex-col">
          <div className="inline-flex flex-wrap items-center gap-2">
            {selectedItems.map(function renderSelectedItem(
              selectedItemForRender: any,
              index: number
            ) {
              return (
                <span
                  className="rounded-md bg-gray-100 px-2 py-1"
                  key={`selected-item-${index}`}
                  {...getSelectedItemProps({
                    selectedItem: selectedItemForRender,
                    index,
                  })}
                >
                  {selectedItemForRender[`name_${i18n.language}`]}
                  <span
                    className="cursor-pointer px-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItems(selectedItemForRender);
                    }}
                  >
                    &#10005;
                  </span>
                </span>
              );
            })}
            <div className="relative flex grow gap-0.5">
              <Input
                placeholder={t("profile:andrology")}
                className="w-full placeholder:text-slate-400"
                {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
              />
              <button
                aria-label="toggle menu"
                className="absolute right-0 top-2 px-2"
                type="button"
                {...getToggleButtonProps()}
              >
                &#8595;
              </button>
            </div>
          </div>
        </div>
        <ul
          className={`w-inherit absolute z-10 mt-1 max-h-80 overflow-scroll bg-white p-0 shadow-md ${
            !(isOpen && items.length) && "hidden"
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            items.map((item: any, index: number) => (
              <li
                className={
                  "w-full" &&
                  cx(
                    highlightedIndex === index && "bg-blue-300",
                    selectedItem === item && "font-bold",
                    "flex flex-col px-3 py-2 shadow-sm"
                  )
                }
                key={index}
                {...getItemProps({ item, index })}
              >
                <span className="text-lg text-black">{item[`name_${i18n.language}`]}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
  return <MultipleComboBox />;
};
