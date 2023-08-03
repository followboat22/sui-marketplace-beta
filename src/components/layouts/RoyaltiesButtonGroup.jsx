import React, { useState } from "react";
import { escapeRegExp } from "../../utils/form";
//import StandardToolTip from "components/StandardToolTip/StandardToolTip";

const royaltiesErrorMessage = {
  InvalidInput: "InvalidInput",
  RiskyLow: "RiskyLow",
  RiskyHigh: "RiskyHigh",
};

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d{0,2}$`);

const RoyaltiesButtonGroup = ({ input, label, meta: { touched, error, warning } }) => {
  const { onChange, onBlur } = input;
  const [royaltiesAmount, setRoyaltiesAmount] = useState(500);
  const [royaltiesInput, setRoyaltiesInput] = useState("");

  const royaltiesInputIsValid =
    royaltiesInput === "" ||
    (royaltiesAmount / 100).toFixed(1) === Number.parseFloat(royaltiesInput).toFixed(1);

  let royaltiesError;
  if (royaltiesInput !== "" && !royaltiesInputIsValid) {
    royaltiesError = royaltiesErrorMessage.InvalidInput;
  } else if (royaltiesInputIsValid && royaltiesAmount < 500) {
    royaltiesError = royaltiesErrorMessage.RiskyLow;
  } else if (royaltiesInputIsValid && royaltiesAmount > 2500) {
    royaltiesError = royaltiesErrorMessage.RiskyHigh;
  } else {
    royaltiesError = undefined;
  }

  const parseCustomRoyalties = (value) => {
    if (value === "" || inputRegex.test(escapeRegExp(value))) {
      setRoyaltiesInput(value);

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt(
          (Number.parseFloat(value) * 100).toString()
        );
        if (
          !Number.isNaN(valueAsIntFromRoundedFloat) &&
          valueAsIntFromRoundedFloat < 5000
        ) {
          setRoyaltiesAmount(valueAsIntFromRoundedFloat);
          return valueAsIntFromRoundedFloat;
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="field-container">
      <h4 className="title-list-item">{label}</h4>
      <div className="flex-space-between">
        <button
          type="button"
          className={`sc-button fl-button pri-3 royalties-button ${
            royaltiesAmount === 500 ? "royalties-button-selected" : ""
          }`}
          onClick={() => {
            setRoyaltiesInput("");
            setRoyaltiesAmount(500);
            onChange(500);
          }}
        >
          5.0%
        </button>
        <button
          type="button"
          className={`sc-button fl-button pri-3 royalties-button ${
            royaltiesAmount === 1000 ? "royalties-button-selected" : ""
          }`}
          onClick={() => {
            setRoyaltiesInput("");
            setRoyaltiesAmount(1000);
            onChange(1000);
          }}
        >
          10.0%
        </button>
        <button
          type="button"
          className={`sc-button fl-button pri-3 royalties-button ${
            royaltiesAmount === 1500 ? "royalties-button-selected" : ""
          }`}
          onClick={() => {
            setRoyaltiesInput("");
            setRoyaltiesAmount(1500);
            onChange(1500);
          }}
        >
          15.0%
        </button>

        <input
          {...input}
          className="royalties-input"
          inputMode="decimal"
          pattern="^[0-9]*[.,]?[0-9]{0,2}$"
          placeholder={(royaltiesAmount / 100).toFixed(1)}
          value={royaltiesInput}
          onBlur={() => {
            onBlur(parseCustomRoyalties((royaltiesAmount / 100).toFixed(2)));
          }}
          onChange={(event) => {
            if (event.currentTarget.validity.valid) {
              onChange(parseCustomRoyalties(event.target.value.replace(/,/g, ".")));
            }
          }}
        />
      </div>
      {!!royaltiesError && (
        <p
          style={{
            fontSize: "14px",
            marginTop: "8px",
            color:
              royaltiesError === royaltiesErrorMessage.InvalidInput ? "red" : "#F3841E",
            fontWeight: 600,
          }}
        >
          {royaltiesError === royaltiesErrorMessage.InvalidInput
            ? "Enter a valid royalties percentage"
            : royaltiesError === royaltiesErrorMessage.RiskyLow
            ? "Your royalties are below the recommended amount of 5%"
            : "Your royalties account for more than 25% of the cost of each item. Are you sure?"}
        </p>
      )}
    </div>
  );
};

export default RoyaltiesButtonGroup;
