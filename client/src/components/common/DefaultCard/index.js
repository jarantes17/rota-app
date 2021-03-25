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

export const DefaultCard = ({ title, subtitle, value, display }) => {
  return (
    <>
      <div className="p-2 w-100">
        <Card width="100%" className="text-center shadow-sm rounded">
          <CardBody className="card-body">
            {title && <CardTitle className="h5">{title}</CardTitle>}
            <CardText>
              {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
              <h1 className={`display-${display}`}>{value}</h1>
            </CardText>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

DefaultCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  display: PropTypes.number.isRequired
}
