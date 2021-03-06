import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, MenuItem, Button } from "@material-ui/core";
import { capitalize } from "utils/string";
import { FileInput } from "components/FileInput";

/********************************************************
 * @param fields: [
 * 	type (Str, required): 'text' | 'number' | 'select' | 'group'
 * 	name (Str, required): corresponding state prop AND react key
 *  config: ...TO ADD...
 * ]
 ********************************************************/

const useStyles = makeStyles((theme) => ({
	stack: ({ layout, numItems }) => {
		const baseStyles = {
			display: "grid",
			gridGap: theme.spacing(3),
		};
		if (layout === "row") {
			baseStyles.gridTemplateColumns = `repeat(${numItems}, 1fr)`;
		}
		if (layout === "row--right-item-auto") {
			baseStyles.gridTemplateColumns = `repeat(${numItems - 1}, 1fr) auto`;
		}
		return baseStyles;
	},
	inputContainer: {
		"& > label": {
			textTransform: "capitalize",
		},
		"& .fileUploadButton": {
			padding: theme.spacing(2),
		},
	},
	hidden: { display: "none" },
}));

export const Form = ({ fields, state, setState, layout }) => {
	const c = useStyles({ layout, numItems: fields.length });

	const handleChange = (e) => {
		let { name, value, type } = e.target;
		if (type === "number") value = Number(value);
		setState({ ...state, [name]: value });
	};

	return (
		<div className={c.stack}>
			{fields.map(([type, name, config]) => {
				if (!config) config = {};

				const { label, options, req, err, fields, layout, multiline } = config;
				const { min = 0, max = null, handler, color, variant } = config;
				const { disabled, helperText } = config;

				const baseProps = {
					key: name,
					variant: variant || "outlined",
					disabled: disabled || false,
				};

				const inputProps = {
					...baseProps,
					name,
					type,
					helperText,
					label: err || label || name,
					error: !!err,
					required: !!req,
					onChange: handleChange,
					className: c.inputContainer,
				};

				const textInputProps = {
					...inputProps,
					value: state[name] || "",
					multiline,
				};

				const numberInputProps = {
					...inputProps,
					value: state[name] || 0,
					inputProps: { min, max },
				};

				const buttonInputProps = {
					...baseProps,
					children: label || name,
					onClick: handler,
					color: color || "default",
				};

				const renderOption = (option) => {
					const [value, label] = Array.isArray(option)
						? option
						: [option, capitalize(option)];
					return (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					);
				};

				return ["text", "tel", "email"].includes(type) ? (
					<TextField {...textInputProps} />
				) : type === "number" ? (
					<TextField {...numberInputProps} />
				) : type === "select" ? (
					<TextField {...textInputProps} select>
						{options.map(renderOption)}
					</TextField>
				) : type === "button" ? (
					<Button {...buttonInputProps} />
				) : type === "file" ? (
					<FileInput {...inputProps} />
				) : type === "group" ? (
					<Form {...{ ...baseProps, fields, layout, state, setState }} />
				) : null;
			})}
		</div>
	);
};
