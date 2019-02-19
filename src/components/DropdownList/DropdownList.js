// import React from 'react';
// import ReactDOM from 'react-dom';
// import FormGroup from 'react-bootstrap/lib/FormGroup';
// import ControlLabel from 'react-bootstrap/lib/ControlLabel';
// import Col from 'react-bootstrap/es/Col';
// import Autocomplete from 'Autocomplete';
// import FormControl from 'react-bootstrap/es/FormControl';
// import pure from './pure';


// const countries =  [
//     { label: 'No Country', text: '', value: null, static: true },
//     null,
//     { text: 'Disabled Option', disabled: true, static: true },
//     null,
//     { text: 'Afghanistan', value: 'value--Afghanistan' },
//     { text: 'Albania', value: 'value--Albania' },
//  ]


// const DropdownList = pure(({ value, onChange }) => (
//     <FormGroup>
//       <Col componentClass={ControlLabel} xs={3}>
//         Autocomplete:
//       </Col>
//       <Col xs={6}>
//         <Autocomplete
//           value={value}
//           options={countries}
//           onChange={e => onChange(e.target.value)}
//         >
//           {(inputProps, otherProps, registerInput) => (
//             <FormControl
//               ref={c => registerInput(ReactDOM.findDOMNode(c))}
//               type="text"
//               {...inputProps}
//             />
//           )}
//         </Autocomplete>
//       </Col>
//     </FormGroup>
//   ));



//   export default DropdownList