import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import { createNewClinic } from "../../../services/userService";
import { toast } from "react-toastify";
import {
  getAllClinic,
  getAllDetailClinicById,
  deleteClinic,
  editClinic,
} from "../../../services/userService";
const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      arrClinic: [],
      isEditClinic: false,
    };
  }

  async componentDidMount() {
    await this.getAllClinicFromReact();
  }

  getAllClinicFromReact = async () => {
    let response = await getAllClinic();
    if (response && response.errCode === 0) {
      this.setState({
        arrClinic: response.data,
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    // if (this.props.language !== prevProps.language) {
    //   let allDays = this.getArrDays(this.props.language);
    //   this.setState({
    //     allDays: allDays,
    //   });
    // }
    // if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
    //   let allDays = this.getArrDays(this.props.language);
    //   let res = await getScheduleDoctorByDate(
    //     this.props.doctorIdFromParent,
    //     allDays[0].value
    //   );
    //   this.setState({
    //     allAvailableTime: res.data ? res.data : [],
    //   });
    // }
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.State };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveNewClinic = async () => {
    let res = await createNewClinic(this.state);
    if (res && res.errCode === 0) {
      toast.success("Add new clinic succeeds!");
      await this.getAllClinicFromReact();
      this.setState({
        name: "",
        address: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    } else {
      toast.error("Something wrongs....");
      console.log("check res: ", res);
    }
  };

  handleDeleteClinic = async (clinic) => {
    try {
      let res = await deleteClinic(clinic.id);
      if (res && res.errCode === 0) {
        toast.success("Delete clinic succeeds!");
        await this.getAllClinicFromReact();
      } else {
        toast.error("Something wrongs....");
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleEditClinic = (clinic) => {
    console.log("check edit clinic", clinic);
    this.setState({
      isEditClinic: true,
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      image: clinic.image,
      descriptionHTML: clinic.descriptionHTML,
      descriptionMarkdown: clinic.descriptionMarkdown,
    });
  };

  doEditClinic = async () => {
    console.log("check state doEditClinic", this.state);
    try {
      let res = await editClinic(this.state);

      if (res && res.errCode === 0) {
        toast.success("Edit clinic succeeds!");
        await this.getAllClinicFromReact();
        this.setState({
          name: "",
          imageBase64: "",
          address: "",
          descriptionHTML: "",
          descriptionMarkdown: "",
          isEditClinic: false,
        });
      } else {
        toast.error("Something wrongs....");
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    // let { allDays, allAvailableTime } = this.state;
    // let { language } = this.props;
    console.log("check state", this.state);
    let arrClinic = this.state.arrClinic;
    return (
      <>
        <div className="manage-clinic-container">
          <div className="ms-title title">
            {" "}
            <FormattedMessage id="clinic.manage-clinic" />
          </div>
          <div className="add-new-clinic row">
            <div className="col-6 form-group">
              <label>
                {" "}
                <FormattedMessage id="clinic.clinic-name" />
              </label>
              <input
                className="form-control"
                type="text"
                value={this.state.name}
                onChange={(event) => this.handleOnChangeInput(event, "name")}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                {" "}
                <FormattedMessage id="clinic.image" />
              </label>
              <input
                className="form-control-file"
                type="file"
                onChange={(event) => this.handleOnchangeImage(event)}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                {" "}
                <FormattedMessage id="clinic.clinic-address" />
              </label>
              <input
                className="form-control"
                type="text"
                value={this.state.address}
                onChange={(event) => this.handleOnChangeInput(event, "address")}
              />
            </div>
            <div className="col-12">
              <MdEditor
                style={{ height: "300px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChange}
                value={this.state.descriptionMarkdown}
              />
            </div>
            <div className="col-12">
              <button
                className={
                  this.state.isEditClinic === false
                    ? "btn-save-clinic btn-primary"
                    : "btn-edit-clinic btn-warning"
                }
                onClick={
                  this.state.isEditClinic === false
                    ? () => this.handleSaveNewClinic()
                    : () => this.doEditClinic()
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <div className="ms-title title mt-3">
          {" "}
          <FormattedMessage id="clinic.list-clinic" />
        </div>
        <div className="users-table mt-3 mx-5 mb-5">
          <table id="customers">
            <tbody>
              <tr>
                <th>
                  {" "}
                  <FormattedMessage id="clinic.number" />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id="clinic.clinic-name" />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id="clinic.clinic-address" />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id="clinic.action" />
                </th>
              </tr>

              {arrClinic &&
                arrClinic.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.address}</td>
                      {/* <td>{item.lastName}</td>
                      <td>{item.address}</td> */}
                      <td>
                        <button
                          className="btn-edit "
                          onClick={() => this.handleEditClinic(item)}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => this.handleDeleteClinic(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
