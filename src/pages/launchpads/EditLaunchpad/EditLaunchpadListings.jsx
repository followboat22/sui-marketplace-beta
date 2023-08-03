import ToastPopup from "../../../components/utils/ToastPopup";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray } from "redux-form";
import { initFormVals } from "../../../redux/state/initialValues";
import { renderInventories } from "../../../utils/form";
import { sleep } from "../../../utils/time";
import {
  updateLaunchPadStatus,
  updateLaunchpadSale,
  updateLaunchpadLimit,
} from "../../../web3/sui";

const formName = "edit-launchpad";
const EditLaunchpadListings = ({ launchpad }) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.form[formName]);

  useEffect(async () => {
    dispatch(initFormVals(formName, launchpad));
    return () => {
      dispatch(initFormVals(formName));
    };
  }, []);

  const priceUpdate = async (index) => {
    const tx = await updateLaunchpadSale(
      launchpad,
      index,
      form.values.sales[index].price
    );
    if (tx?.status === "success") {
      ToastPopup("Mintpad successfully updated.", "success");
    }
  };

  const limitUpdate = async (index) => {
    const tx = await updateLaunchpadLimit(
      launchpad,
      index,
      form.values.sales[index].limit
    );
    if (tx?.status === "success") {
      ToastPopup("Mintpad successfully updated.", "success");
    }
  };

  const setLive = async (index, start = true) => {
    const tx = await updateLaunchPadStatus(launchpad, index, start);
    await sleep();
    if (tx?.status === "success") {
      ToastPopup("Mintpad successfully updated.", "success");
    }
  };

  return (
    <div>
      <FieldArray
        name="sales"
        component={renderInventories}
        props={{
          launchpad,
          sales: launchpad.sales,
          priceUpdate,
          limitUpdate,
          setLive,
        }}
        rerenderOnEveryChange
      />
    </div>
  );
};

export default EditLaunchpadListings;
