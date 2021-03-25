import React from "react"
import PropTypes from "prop-types"
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle
} from "reactstrap"

export const InfoCard = ({ title, subtitle, quantity, onClick }) => {
  return (
    <>
      <div className="p-2 w-100">
        <Card width="100%" className="text-center shadow rounded">
          <CardBody className="card-body">
            <CardTitle className="h5">{title}</CardTitle>
            <CardText>
              <CardSubtitle>{subtitle}</CardSubtitle>
              <h1>{quantity ?? 0}</h1>
            </CardText>
            <Button color="primary" onClick={onClick}>
              Detalhes
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}
