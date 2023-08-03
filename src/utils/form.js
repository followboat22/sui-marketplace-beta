import {
    change,
    Field,
    FieldArray
} from "redux-form";
import {
    FileInput
} from "../components/layouts/FileUpload";
import {
    useSelector
} from "react-redux";
import AsyncSelect from "react-select";
import Accordion from "../components/layouts/Accordion";
import ToggleButton from "../components/button/ToggleButton";
import LaunchpadTierAccordion from "../components/layouts/launchpad/LaunchpadTierAccordion";

export const requiredValidator = (value) => (value ? undefined : "Required");

export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const humanizeName = (name) => {
    if (!name) return "";
    let capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return capitalized.replace("_", " ");
};

export const hasError = (form, fieldName) => {
    if (
        form &&
        ((form.syncErrors && form.syncErrors[fieldName]) ||
            (form.submitErrors && form.submitErrors[fieldName])) &&
        form.fields &&
        form.fields[fieldName] &&
        form.fields[fieldName].visited
    ) {
        return true;
    }
};

export const formError = (form, fieldName) => {
    if (hasError(form, fieldName)) {
        return ( 
            <div className = "form-error" > {
                form.syncErrors ?.[fieldName] || form.submitErrors ?.[fieldName]
            } 
            </div>
        );
    }
};

export const renderForm = (form, name, options = {}) => {
        if (options.nocontainer) {
            return options.children ? ( <
                Field name = {
                    name
                } { ...options
                } > {
                    options.children
                } </Field>
            ) : ( <
                Field name = {
                    name
                } { ...options
                }
                />
            );
        }
        return ( <
            div className = {
                `field-container ${options.containername ? options.containername : ""} ${
        hasError(form, name) ? "field-error" : ""
      } ${options.required ? "required" : ""}`
            } >
            {!options.hidename && ( <
                    h4 className = {
                        `${options.labelClass ? options.labelClass : "title-list-item"}`
                    } > {
                        options.title ? options.title : humanizeName(name)
                    } </h4>
                )
            }

            <
            div className = "flex h-100" > {
                options.children ? ( <
                    Field name = {
                        name
                    } { ...options
                    } > {
                        options.children
                    } 
                    </Field>
                ) : ( <
                    Field name = {
                        name
                    } { ...options
                    }
                    />
                )
            } {
                options.deleteable && (
                    <button className = "btn small"
                    type = "button">
                    X 
                    </button>
                )
            } </div> {
                options.subText && < p className = "subtext" > {
                        options.subText
                    } </p>}
                     {
                        formError(form, name)
                    } 
                    </div>
            );
        };

        export const renderFormV2 = ({
                placeholder,
                hidename,
                nocontainer,
                subtitle,
                subtitleClass,
                input,
                appendTitle,
                ...field
            }) => {
                let inputField = false;
                switch (field.type) {
                    case "textarea":
                        inputField = ( <
                            textarea placeholder = {
                                placeholder
                            }
                            required = {
                                field.required
                            } { ...field
                            } { ...input
                            }
                            />
                        );
                        break;
                    case "file":
                        inputField = ( <
                            FileInput input = {
                                input
                            }
                            featuredImage = {
                                field.featuredImage
                            } { ...field
                            }
                            />
                        );
                        break;
                    case "select":
                        inputField = ( <
                            select required = {
                                field.required
                            } { ...input
                            } { ...field
                            } > {
                                field.children
                            } 
                            </select>
                        );
                        break;
                    default:
                        inputField = < input placeholder = {
                            placeholder
                        } { ...input
                        } { ...field
                        }
                        />;
                        break;
                }

                if (nocontainer) {
                    return inputField;
                }

                return ( 
                    <div className = {
                        `field-container ${field.containername ? field.containername : ""} ${
        field.meta.error ? "field-error" : ""
      } ${field.required ? "required" : ""}`
                    } >
                    {!hidename && ( 
                        <h4 className = {
                                `${
            field.labelClass ? field.labelClass : !subtitle ? "title-list-item" : ""
          }`
                            } >
                            {
                                field.title ? field.title : humanizeName(input.name)
                            } {
                                appendTitle
                            } </h4>
                        )
                    } {
                        subtitle && ( 
                            <p className = {
                                `${subtitleClass ? subtitleClass : "field-subtitle"}`
                            } > {
                                subtitle
                            } </p>
                        )
                    } <div className = "flex h-100" > {
                        inputField
                    } </div> {
                        field.subText && < p className = "subtext" > {
                                field.subText
                            } </p>} {
                                field.meta.touched && field.meta.error && ( <
                                    p className = "error" > {
                                        field.meta.error
                                    } </p>
                                )
                            } 
                            </div>
                    );
                };

                export const RenderSelectInput = ({
                    input,
                    options,
                    name,
                    id,
                    ...field
                }) => {
                    return ( <
                        div className = {
                            `field-container ${field.containername ? field.containername : ""} ${
        field.meta.error ? "field-error" : ""
      } ${field.required ? "required" : ""}`
                        } >
                        <h4 className = "title-list-item" > {
                            field.title ? field.title : humanizeName(input.name)
                        } 
                        </h4> <
                        AsyncSelect { ...input
                        } { ...field
                        }
                        id = {
                            id
                        }
                        name = {
                            name
                        }
                        options = {
                            options
                        }
                        required = {
                            field.required
                        }
                        value = {
                            options.find((o) => o.value === input.value)
                        }
                        onChange = {
                            ({
                                value
                            }) => input.onChange(value)
                        }
                        onBlur = {
                            () => input.onBlur()
                        }
                        /> {
                            field.meta.touched && field.meta.error && ( <
                                p className = "error" > {
                                    field.meta.error
                                } </p>
                            )
                        } 
                        </div>
                    );
                };

                const renderOptions = ({
                    fields,
                    index,
                    title
                }) => {
                    return ( <
                        ul className = "pl-20" >
                        <
                        div className = "flex-space-between" >
                        <
                        h4 className = "title-list-item" > {
                            title
                        } </h4> 
                        <button className = "btn small fl-right"
                        type = "button"
                        onClick = {
                            () => fields.push("")
                        } >
                        Add Option 
                        </button> 
                        </div> {
                            fields.length === 0 && ( <
                                li key = {
                                    0
                                } >
                                <
                                div className = "flex" >
                                <
                                Field name = {
                                    `fields[${index}].values[0]`
                                }
                                type = "text"
                                component = {
                                    renderField
                                }
                                fullWidth validate = {
                                    [requiredValidator]
                                }
                                /> 
                                </div> 
                                </li>
                            )
                        } {
                            fields.map((item, index) => {
                                return ( <
                                    li key = {
                                        index
                                    } >
                                    <
                                    div className = "flex" >
                                    <
                                    Field name = {
                                        item
                                    }
                                    type = "text"
                                    component = {
                                        renderField
                                    }
                                    fullWidth validate = {
                                        [requiredValidator]
                                    }
                                    /> {
                                        index > 0 && ( <
                                            button className = "btn small"
                                            type = "button"
                                            onClick = {
                                                () => fields.remove(index)
                                            } >
                                            -
                                            </button>
                                        )
                                    } 
                                    </div> 
                                    </li>
                                );
                            })
                        } 
                        </ul>
                    );
                };

                export const renderSetTags = ({
                    className
                }) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const tags = useSelector((state) => state.settings ?.tags);
                    return ( <
                        div className = {
                            `${className || ""} field-tags`
                        } > {
                            tags.map((item, index) => ( 
                                <span className = "field-tag"
                                key = {
                                    item._id
                                } >
                                <label htmlFor = {
                                    `tags.${item.name}`
                                } > {
                                    item.name
                                } </label> 
                                <Field key = {
                                    item.name
                                }
                                id = {
                                    `tags.${item.name}`
                                }
                                name = {
                                    `tags.${index}`
                                }
                                type = "checkbox"
                                component = "input"
                                format = {
                                    (v) => v === item._id
                                } // converts redux state string to boolean
                                normalize = {
                                    (v) => (v ? item._id : false)
                                } // converts checkbox boolean to string
                                /> 
                                </span>
                            ))
                        } {
                            " "
                        } 
                        </div>
                    );
                };

                export const renderSearchFields = ({
                    fields,
                    title
                }) => ( <>
                    <div className = "flex-space-between">
                    <h2 className = "mg-bt-24 mg-t-24"> {
                        title
                    } </h2> 
                    <button style = {
                        {
                            height: "min-content",
                            width: "50%"
                        }
                    }
                    className = "fullWidth"
                    type = "button"
                    onClick = {
                        () => fields.push({
                            name: "",
                            type: "string"
                        })
                    } >
                    Add Metadata Field 
                    </button> 
                    </div> 
                    <ul > {
                        fields.map((val, index) => {
                            return renderSubFields(val, index, fields);
                        })
                    } 
                    </ul> 
                    </>
                );

                const handleSelectChange = (newValue, name, dispatch, formName) => {
                    dispatch(change(formName, `${name}.type`, newValue));
                    dispatch(change(formName, `${name}.values`, [""]));
                };

                const renderSubFields = (item, index, fields) => ( 
                    <li key = {index}>
                    <div className = "field-container" >
                    <div className = "row-form style-3" >
                    <div className = "inner-row-form fullWidth" >
                    <h4 className = "title-list-item" > Field Name </h4> 
                    <Field name = {
                        `${item}.name`
                    }
                    type = "text"
                    validate = {
                        [requiredValidator]
                    }
                    component = {
                        renderField
                    }
                    /> 
                    </div> 
                    <div className = "inner-row-form fullWidth">
                    <h4 className = "title-list-item" > Field Type </h4> 
                    <Field name = {
                        `${item}.type`
                    }
                    item = {
                        item
                    }
                    component = {
                        renderSelect
                    }
                    title = {
                        item
                    } >
                    <option value = "hidden" > hidden </option> 
                    <option value = "number" > number </option> 
                    <option value = "string" > string </option> 
                    <option value = "select" > select </option> 
                    </Field> 
                    </div> 
                    <div className = "inner-row-form fullWidth">
                    <button type = "button"
                    className = "btn small"
                    style = {
                        {
                            marginTop: "47px"
                        }
                    }
                    onClick = {
                        () => fields.remove(index)
                    } >
                    Delete Field 
                    </button> 
                    </div> 
                    </div> 
                    </div> 
                    <div className = "field-container" > {
                        fields.get(index).type === "select" && ( <
                            FieldArray name = {
                                `${item}.values`
                            }
                            props = {
                                {
                                    title: `${fields.get(index)?.name} Options`,
                                    type: "text",
                                    component: "input",
                                    index,
                                }
                            }
                            component = {
                                renderOptions
                            }
                            />
                        )
                    } 
                    </div> 
                    </li>
                );

                /**
                 * Launchpad fields
                 */

                export const renderLaunchpadFields = ({
                    fields,
                    title,
                    required,
                    renderLaunchpadSection,
                }) => {
                    if (required && fields.length === 0) {
                        fields.push({});
                    }
                    return ( 
                        <div className = "field-container">
                        <h2 className = "mg-bt-24 mg-t-24" > {
                            title
                        } </h2> 
                        <ul> {
                            fields.map((val, index) => {
                                return renderLaunchpadSection(val, index, fields);
                            })
                        } 
                        </ul> 
                        <div className = "flex justify-content-center">
                        <button style = {
                            {
                                height: "min-content",
                                width: "50%"
                            }
                        }
                        className = "fullWidth"
                        type = "button"
                        onClick = {
                            () => fields.push({})
                        } >
                        Add Field 
                        </button> 
                        </div> 
                        </div>
                    );
                };

                export const renderRoadmapFields = (item, index, fields) => ( 
                    <li key = {
                        index
                    } >
                    <div className = "field-container" >
                    <div className = "row-form  pl-20" >
                    <div className = "flex-space-between" >
                    <h3 className = "mg-bt-24 mg-t-24" > Roadmap Section# {
                        index + 1
                    } </h3> {
                        index > 0 && ( 
                            <button style = {
                                {
                                    height: "min-content"
                                }
                            }
                            type = "button"
                            onClick = {
                                () => fields.remove(index)
                            } >
                            Delete Field 
                            </button>
                        )
                    } 
                    </div> 
                    <div className = "pl-20" >
                    <Field name = {
                        `${item}.title`
                    }
                    type = "text"
                    title = "Roadmap Section Title"
                    validate = {
                        [requiredValidator]
                    }
                    containername = "required"
                    component = {
                        renderFormV2
                    }
                    />

                    <Field name = {
                        `${item}.date`
                    }
                    type = "text"
                    title = "Date"
                    placeholder = "e.g., 'Q1 2022', 'Summer', '15-10-2022'"
                    validate = {
                        [requiredValidator]
                    }
                    containername = "required"
                    component = {
                        renderFormV2
                    }
                    />

                    <Field name = {
                        `${item}.image`
                    }
                    type = "text"
                    title = "Image URL"
                    validate = {
                        [requiredValidator]
                    }
                    containername = "required"
                    component = {
                        renderFormV2
                    }
                    /> 
                    <div className = "inner-row-form fullWidth" >
                    <FieldArray name = {
                        `${item}.points`
                    }
                    title = "Roadmap Points"
                    component = {
                        renderRoadmapPoints
                    }
                    /> 
                    </div> 
                    </div> 
                    </div> 
                    </div> 
                    </li>
                );

                const renderRoadmapPoints = ({
                    fields,
                    title
                }) => {
                    if (fields.length === 0) {
                        fields.push("");
                    }
                    return ( 
                        <div className = "field-container required" >
                        <div className = "flex-space-between" >
                        <h4 className = "title-list-item" > {
                            title
                        } </h4> 
                        <button className = "btn fl-right"
                        type = "button"
                        style = {
                            {
                                fontSize: "20px",
                                fontWeight: "700",
                                height: "52px",
                                width: "52px"
                            }
                        }
                        onClick = {
                            () => fields.push("")
                        } >
                        +
                        </button> 
                        </div> 
                        <ul className = "pl-20" > {
                            fields.map((item, index) => {
                                return ( 
                                    <li key = {
                                        index
                                    } >
                                    <div className = "flex" >
                                    <Field name = {
                                        item
                                    }
                                    type = "text"
                                    fullWidth component = {
                                        renderField
                                    }
                                    validate = {
                                        [requiredValidator]
                                    }
                                    /> {
                                        index > 0 && ( 
                                            <button className = "btn"
                                            type = "button"
                                            style = {
                                                {
                                                    fontSize: "20px",
                                                    fontWeight: "700",
                                                    height: "52px",
                                                    width: "52px",
                                                }
                                            }
                                            onClick = {
                                                () => fields.remove(index)
                                            } >
                                            -
                                            </button>
                                        )
                                    } 
                                    </div> 
                                    </li>
                                );
                            })
                        } 
                        </ul> 
                        </div>
                    );
                };

                export const renderTeamFields = (item, index, fields) => ( 
                    <li key = {
                        index
                    } >
                    <div className = "field-container" >
                    <div className = "row-form  pl-20" >
                    <div className = "flex-space-between" >
                    <h3 className = "mg-bt-24 mg-t-24" > Team Member# {
                        index + 1
                    } </h3> {
                        index> 0 && ( 
                            <button style = {
                                {
                                    height: "min-content"
                                }
                            }
                            type = "button"
                            onClick = {
                                () => fields.remove(index)
                            } >
                            Delete Field 
                            </button>
                        )
                    } 
                    </div> 
                    <div className = "pl-20" >
                    <Field name = {
                        `${item}.member`
                    }
                    type = "text"
                    title = "Team Member Name"
                    validate = {
                        [requiredValidator]
                    }
                    containername = "required"
                    component = {
                        renderFormV2
                    }
                    /> 
                    <Field name = {
                        `${item}.bio`
                    }
                    type = "textarea"
                    title = "Bio"
                    validate = {
                        [requiredValidator]
                    }
                    containername = "required"
                    component = {
                        renderFormV2
                    }
                    /> 
                    <Field name = {
                        `${item}.image`
                    }
                    type = "text"
                    title = "Image URL"
                    validate = {
                        [requiredValidator]
                    }
                    containername = "required"
                    component = {
                        renderFormV2
                    }
                    /> 
                    </div> 
                    </div> 
                    </div> 
                    </li>
                );

                export const renderFAQFields = (item, index, fields) => ( 
                <li key = {
                        index
                    } >
                    <div className = "field-container" >
                    <div className = "row-form  pl-20" >
                    <div className = "flex-space-between" >
                    <h3 className = "mg-bt-24 mg-t-24" > FAQ# {
                        index + 1
                    } </h3>

                    <button style = {
                        {
                            height: "min-content"
                        }
                    }
                    type = "button"
                    onClick = {
                        () => fields.remove(index)
                    } >
                    Delete Field 
                    </button> 
                    </div> 
                    <div className = "pl-20" >
                    <div className = "inner-row-form fullWidth" >
                    <h4 className = "sub-list-item" > Question </h4> 
                    <Field name = {
                        `${item}.question`
                    }
                    type = "text"
                    validate = {
                        [requiredValidator]
                    }
                    component = {
                        renderField
                    }
                    /> 
                    </div> 
                    <div className = "inner-row-form fullWidth" >
                    <h4 className = "sub-list-item" > Answer </h4> 
                    <Field name = {
                        `${item}.answer`
                    }
                    type = "text"
                    validate = {
                        [requiredValidator]
                    }
                    component = {
                        renderField
                    }
                    /> 
                    </div> 
                    </div> 
                    </div> 
                    </div> 
                    </li>
                );

                const renderSelect = (field) => {
                    return ( 
                        <select { ...field.input
                        }
                        onChange = {
                            (e) =>
                            handleSelectChange(
                                e.target.value,
                                field.item,
                                field.meta.dispatch,
                                field.meta.form
                            )
                        } >
                        {
                            field.children
                        } 
                        </select>
                    );
                };

                export const renderField = (field) => ( 
                    <div className = {
                        `input-row ${field.fullWidth ? "fullWidth" : ""}`
                    } >
                    <
                    input { ...field.input
                    }
                    type = {
                        field.type
                    }
                    placeholder = {
                        field.placeholder
                    }
                    /> {
                        field.meta.touched && field.meta.error && ( 
                            <span className = "error" > {
                                field.meta.error
                            } </span>
                        )
                    } 
                    </div>
                );

                export const renderToggle = (field) => ( 
                    <div className = {
                        `input-row ${field.fullWidth ? "fullWidth" : ""}`
                    } >
                    <
                    ToggleButton { ...field
                    }
                    /> 
                    </div>
                );

                export const renderTextArea = (field) => ( 
                    <div className = {
                        `input-row ${field.fullWidth ? "fullWidth" : ""}`
                    } >
                    <textarea { ...field.input
                    }
                    type = {
                        field.type
                    }
                    placeholder = {
                        field.placeholder
                    }
                    /> {
                        field.meta.touched && field.meta.error && ( 
                            <span className = "error" > {
                                field.meta.error
                            } </span>
                        )
                    } 
                    </div>
                );

                const renderSwitchFieldType = (field) => {
                    switch (field.type) {
                        case "select":
                            return ( 
                                <div className = "field-tags" > {
                                    field.values.map((value) => ( 
                                        <span className = "field-tag"
                                        key = {
                                            value
                                        } >
                                        <label htmlFor = {
                                            `metadata.${field.name}.${value}`
                                        } > {
                                            value
                                        } </label> 
                                        <Field key = {
                                            value
                                        }
                                        id = {
                                            `metadata.${field.name}.${value}`
                                        }
                                        name = {
                                            `metadata.${field.name}`
                                        }
                                        value = {
                                            value
                                        }
                                        type = "radio"
                                        component = "input" 

                                        />
                                        </span>
                                    ))
                                } 
                                </div>
                            );
                        case "number":
                            return ( <
                                Field name = {
                                    `metadata.${field.name}`
                                }
                                type = "number"
                                validate = {
                                    [requiredValidator]
                                }
                                component = {
                                    renderField
                                }
                                />
                            );
                        case "string":
                        default:
                            return ( <
                                Field name = {
                                    `metadata.${field.name}`
                                }
                                type = "text"
                                validate = {
                                    [requiredValidator]
                                }
                                component = {
                                    renderField
                                }
                                />
                            );
                    }
                };

                export const renderCreateNFTFields = ({
                    fields
                }) => ( 
                    <ul > {
                        fields.map((field, index) => {
                            return ( 
                                <li key = {
                                    index
                                } >
                                <div className = "field-container fullWidth" >
                                <h4 className = "title-list-item" > {
                                    field.name
                                } </h4> {
                                    renderSwitchFieldType(field)
                                } 
                                </div> 
                                </li>
                            );
                        })
                    } 
                    </ul>
                );

                // For onchain launchpad related queries

                export const renderInventories = ({
                    launchpad,
                    sales,
                    fields,
                    meta,
                    priceUpdate,
                    setLive,
                    whitelistUpdate,
                    limitUpdate,
                }) => {
                    console.log("meta", meta);
                    if (fields.length === 0) {
                        fields = sales;
                    }
                    return ( 
                        <ul> {
                            fields.map((_, index) => ( 
                                <li key = {
                                    index
                                } >
                                <div className = "field-container fullWidth" >
                                <LaunchpadTierAccordion title = {
                                    `Tier #${index + 1}`
                                }
                                defaultOpen fields = {
                                    fields
                                }
                                index = {
                                    index
                                } >
                                <div className = "row" >
                                <div className = "col-6" >
                                <div className = "field-container" >
                                <Field name = {
                                    `sales[${index}].price`
                                }
                                title = {
                                    `Mint Price`
                                }
                                type = "number"
                                component = {
                                    renderFormV2
                                }
                                /> 
                                </div> 
                                </div> 
                                <div className = "col-6" >
                                <div className = "field-container" >
                                <Field name = {
                                    `sales[${index}].limit`
                                }
                                title = {
                                    `Purchase Limit`
                                }
                                placeholder = "&infin;"
                                type = "number"
                                component = {
                                    renderFormV2
                                }
                                /> 
                                </div> 
                                </div> 
                                <div className = "col-2" >
                                <div className = "field-container" >
                                <h4 className = "title-list-item" > Whitelisted ? </h4> 
                                <Field name = {
                                    `sales[${index}].whitelisted`
                                }
                                component = {
                                    renderToggle
                                }
                                /> 
                                </div> 
                                </div> 
                                <div className = "col-2" >
                                <div className = "field-container" >
                                <h4 className = "title-list-item" > Live ? </h4> 
                                <Field name = {
                                    `sales[${index}].active`
                                }
                                component = {
                                    renderToggle
                                }
                                /> 
                                </div> 
                                </div> 
                                </div> {
                                    sales[index] && ( 
                                        <Accordion title = "Blockchain Info">
                                        <p> Inventory ID: {
                                            sales[index] ?.object_id
                                        } </p> 
                                        <p> Market ID: {
                                            sales[index] ?.market_id
                                        } </p> 
                                        <p> Venue ID: {
                                            sales[index] ?.venue_id
                                        } </p> 
                                        </Accordion>
                                    )
                                } 
                                </LaunchpadTierAccordion> 
                                </div> 
                                </li>
                            ))
                        } 
                        <div className = "flex fullWidth justify-content-center" >
                        <button onClick = {
                            () => fields.push("")
                        }
                        type = "button"
                        style = {
                            {
                                height: "4rem",
                                padding: "0.5rem 2rem",
                                borderRadius: "1rem",
                                fontSize: "20px",
                                // backgroundColor: "var(--primary-color11)",
                            }
                        } >
                        Add New Tier 
                        </button> 
                        </div> 
                        </ul>
                    );
                };