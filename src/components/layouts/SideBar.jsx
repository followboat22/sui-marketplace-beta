import React, { useEffect } from "react";
import { Accordion } from "react-bootstrap-accordion";
import { useDispatch, useSelector } from "react-redux";
import { change, reduxForm, formValueSelector, Field } from "redux-form";
import { renderFormV2 } from "../../utils/form";
import { useSearchParams } from "react-router-dom";
import { useSidebar } from "../utils/SidebarProvider";
import { mystToSui, suiToMyst } from "../../utils/formats";

export const formName = "sidebar-search";

const Option = ({ item, state, selector, handleCheckbox, handleTextField }) => {
  if (item.content.type === "select") {
    return (
      <div className="widget widget-category default boder-bt">
        <Accordion title={item.title} show={true}>
          {item.content.values.map((val) => (
            <div key={val} className="mb-4 flex-space-between">
              <label>
                <span>{val}</span>
              </label>
              <span className="pst-re">
                <Field
                  type="checkbox"
                  containername="hidden"
                  name={`${item.name}.value.${val}`}
                  component={renderFormV2}
                />
                <span
                  onClick={() => handleCheckbox(item, val)}
                  className={`${
                    selector(state, `${item.name}.value.${val}`) ? "checked " : ""
                  }btn-checkbox`}
                />
              </span>
            </div>
          ))}
        </Accordion>
      </div>
    );
  } else {
    if (item.content.type === "number") {
      return (
        <div className="widget widget-category boder-bt">
          <h2>
            <button className="accordion-button">{item.title}</button>
          </h2>
          <div className="flex priceFieldWrapper">
            <Field
              parse={(value) => suiToMyst(value) || value || ""}
              format={(value) => mystToSui(value) || value || ""}
              className="priceField"
              type="number"
              nocontainer
              placeholder="Min"
              name={`${item.name}.gte`}
              component={renderFormV2}
              onChange={(e, newValue) => handleTextField(item, newValue, "gte")}
            />
            <span className="priceTo">to</span>
            <Field
              parse={(value) => suiToMyst(value) || value || ""}
              format={(value) => mystToSui(value) || value || ""}
              className="priceField"
              type="number"
              nocontainer
              placeholder="Max"
              name={`${item.name}.lte`}
              component={renderFormV2}
              onChange={(e, newValue) => handleTextField(item, newValue, "lte")}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="widget widget-category boder-bt">
          <Field
            type="text"
            name={item.title}
            onChange={(e) => handleTextField(item, e.target.value)}
            component={renderFormV2}
          />
        </div>
      );
    }
  }
};

const SideBar = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const selector = formValueSelector(formName);
  const [searchParams, setSearchParams] = useSearchParams();
  // const fields = searchParams.get("fields");
  const params = {};
  searchParams.forEach((value, key) => (params[key] = JSON.parse(value)));
  const { sidebarData } = useSidebar();

  useEffect(() => {
    Object.keys(params).forEach((subcategory) => {
      if (subcategory && Object.keys(params[subcategory]).length > 0) {
        for (const [key, values] of Object.entries(params[subcategory])) {
          if (Array.isArray(values)) {
            values.map((attribute) => {
              const field = `${subcategory}.${key}.value.${attribute}`;
              dispatch(change(formName, field, true));
            });
          } else if (typeof values === "object" && Object.keys(values).length > 0) {
            Object.keys(values).forEach((numberKey) => {
              const field = `${subcategory}.${key}.${numberKey}`;
              dispatch(change(formName, field, values[numberKey]));
            });
          }
        }
      }
    });
  }, []);

  const onSelect = (field) => {
    const val = selector(state, field);
    const changeVal = val ? undefined : true;
    dispatch(change(formName, field, changeVal));
  };

  const handleTextField = (field, value, subField) => {
    const fieldName = field.name;
    const mainKey = fieldName.split(".")[0];
    const subKey = fieldName.split(".")[1];

    const keyExists = searchParams.get(mainKey);
    if (keyExists) {
      //The main key already exists
      let parsedKeys = JSON.parse(keyExists);
      let subKeyValues = parsedKeys[subKey] || {}; // If the subKey doesn't exist, make an empty object

      if (subKeyValues[subField]) {
        subKeyValues[subField] = value;
        if (!value) delete subKeyValues[subField];
      } else {
        if (subField) {
          subKeyValues[subField] = value; // Otherwise, Add the value to the subkey array
        } else {
          subKeyValues = value;
        }
      }

      if (Object.keys(subKeyValues).length === 0) {
        delete parsedKeys[subKey]; // Delete the subkey if it's array is empty
      } else {
        if (subKey) {
          parsedKeys[subKey] = subKeyValues;
        } else {
          parsedKeys = subKeyValues;
        }
      }

      if (Object.keys(parsedKeys).length === 0) {
        searchParams.delete(mainKey);
      } else {
        searchParams.set(mainKey, JSON.stringify(parsedKeys));
      }
    } else {
      //key does not exist. Make it.
      let newMainKey = {};
      if (subField) {
        if (subKey) {
          newMainKey[subKey] = {};
          newMainKey[subKey][subField] = value;
        } else {
          newMainKey = {};
          newMainKey[subField] = value;
        }
      } else {
        if (subKey) {
          newMainKey[subKey] = value;
        } else {
          newMainKey = value;
        }
      }
      searchParams.set(mainKey, JSON.stringify(newMainKey));
    }
    setSearchParams(searchParams);
  };

  const handleCheckbox = (field, value) => {
    const fieldName = field.name;
    const fieldSelector = `${fieldName}.value.${value}`;
    const mainKey = fieldName.split(".")[0];
    const subKey = fieldName.split(".")[1];
    onSelect(fieldSelector);

    const keyExists = searchParams.get(mainKey);
    if (keyExists) {
      //The main key already exists
      let parsedKeys = JSON.parse(keyExists);
      let subKeyValues = parsedKeys[subKey] || []; // If the subKey doesn't exist, make an empty array

      if (subKeyValues.includes(value)) {
        subKeyValues = subKeyValues.filter((item) => item !== value); // if the value exists in the array, remove it
      } else {
        subKeyValues.push(value); // Otherwise, Add the value to the subkey array
      }

      if (Object.keys(subKeyValues).length === 0) {
        delete parsedKeys[subKey]; // Delete the subkey if it's array is empty
      } else {
        parsedKeys[subKey] = subKeyValues;
      }

      if (Object.keys(parsedKeys).length === 0) {
        searchParams.delete(mainKey);
      } else {
        searchParams.set(mainKey, JSON.stringify(parsedKeys));
      }
    } else {
      //key does not exist. Make it.
      const newMainKey = {};
      newMainKey[subKey] = [value];
      searchParams.set(mainKey, JSON.stringify(newMainKey));
    }
    setSearchParams(searchParams);
  };

  return (
    <div id="side-bar" className="side-bar style-3 item">
      <div className="widget widget-filter style-1 mgbt-0">
        <div className="header-widget-filter">
          <h4 className="title-widget">Filter</h4>
        </div>
      </div>
      <div className="divider"></div>
      <form className="wrap-category">
        {sidebarData.map((item, index) => (
          <Option
            state={state}
            selector={selector}
            handleCheckbox={handleCheckbox}
            handleTextField={handleTextField}
            item={item}
            key={index}
          />
        ))}
      </form>
    </div>
  );
};

export default reduxForm({ form: formName })(SideBar);
