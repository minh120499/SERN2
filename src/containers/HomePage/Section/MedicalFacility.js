import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router";
import ShowMore from "../../../components/ShowMore/ShowMore";
import * as actions from "../../../store/actions";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
      showMoreClinics: false,
      clinics: [],
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinic: res.data ? res.data : [],
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
    //   this.setState({
    //     arrDoctors: this.props.topDoctorsRedux,
    //   });
    // }
  }
  handleViewDetailClinic = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${item.id}`);
    }
  };

  handleShowMoreClinics = async () => {
    let res = await getAllClinic(10, 0, "");
    if (res && res.errCode === 0) {
      this.setState({
        showMoreClinics: true,
        clinics: res.data ? res.data : [],
      });
    }
  };

  handleCloseShowMore = () => {
    this.setState({
      showMoreClinics: false,
    });
  };

  handleFilterSearch = async (value = "") => {
    let res = await getAllClinic(10, 0, value);
    if (res && res.errCode === 0) {
      this.setState({
        showMoreClinics: true,
        clinics: res.data ? res.data : [],
      });
    }
  };

  render() {
    let { dataClinic } = this.state;
    let { language } = this.props;
    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.clinic-poplular" />
            </span>
            <button
              className="btn-section"
              onClick={this.handleShowMoreClinics}
            >
              <FormattedMessage id="homepage.more-infor" />
            </button>
            {this.state.showMoreClinics && (
              <ShowMore
                title={<FormattedMessage id="show-more.clinic" />}
                onClose={this.handleCloseShowMore}
                data={this.state.clinics}
                subTitle={
                  <FormattedMessage id="show-more.outstanding-clinic" />
                }
                type="clinic"
                language={language}
                onClick={this.handleViewDetailClinic}
                onSubmit={this.handleFilterSearch}
              />
            )}
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataClinic &&
                dataClinic.length > 0 &&
                dataClinic.map((item, index) => {
                  return (
                    <div
                      className="section-customize clinic-child"
                      key={index}
                      onClick={() => this.handleViewDetailClinic(item)}
                    >
                      <div
                        className="bg-image section-clinic "
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="clinic-name">{item.name}</div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
