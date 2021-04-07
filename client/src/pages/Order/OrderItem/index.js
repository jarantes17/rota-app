import React, { useState } from "react"

import NumberFormat from "react-number-format"

import * as FaIcons from "react-icons/fa"
import { MdAdd, MdCheck, MdEdit, MdSearch } from "react-icons/md"

import { Row, Col } from "reactstrap"

import { format } from "date-fns"
import * as S from "./styles"
import { TableButton } from "../../../styles/global"
import { Tooltip } from "../../../components/common/Tooltip"

export const OrderItem = ({ order, onEditClick, onCloseBillClick }) => {
  return (
    <S.Container>
      <S.OrderItem>
        <Row>
          <Col sm="12" lg="7">
            <Row>
              <Col>
                <S.OrderItemWrapperLeft>
                  <S.OrderItemContent>
                    <FaIcons.FaUser />
                    {order.responsible_name}
                  </S.OrderItemContent>
                </S.OrderItemWrapperLeft>
              </Col>
            </Row>
            <Row>
              <Col>
                <S.OrderItemWrapperLeft>
                  <S.OrderItemCount>
                    {order.total_items}
                    <span> item(s)</span>
                  </S.OrderItemCount>
                </S.OrderItemWrapperLeft>
              </Col>
              <Col>
                {order.id && (
                  <S.OrderItemWrapper>
                    <TableButton
                      background="var(--dark)"
                      onClick={() => {
                        onEditClick(order.id)
                      }}
                      id={`edit_button${order.id}`}
                    >
                      <MdEdit />
                    </TableButton>
                    <Tooltip
                      target={`edit_button${order.id}`}
                      content="Editar"
                    />

                    <TableButton
                      background="var(--success)"
                      onClick={() => {
                        onCloseBillClick(order.id)
                      }}
                      id={`bill_button${order.id}`}
                    >
                      <MdCheck />
                    </TableButton>
                    <Tooltip
                      target={`bill_button${order.id}`}
                      content="Fechar Conta"
                    />
                  </S.OrderItemWrapper>
                )}
              </Col>
            </Row>
            <S.CreationDateInfo>
              {format(
                order?.created_at ? new Date(order.created_at) : new Date(),
                "dd/MM/yyyy HH:mm:ss"
              )}
            </S.CreationDateInfo>
          </Col>
          <Col sm="12" lg="5">
            <Row>
              <Col>
                <S.OrderItemWrapperRight>
                  <S.OrderItemNumber>
                    <span>Nº Pedido: </span> {order.id}
                  </S.OrderItemNumber>
                </S.OrderItemWrapperRight>
              </Col>
            </Row>
            <Row>
              <Col>
                <S.OrderItemWrapperRight>
                  <S.OrderItemContent>
                    <FaIcons.FaChair />
                    {order.board.code}
                  </S.OrderItemContent>
                </S.OrderItemWrapperRight>
              </Col>
            </Row>
            <Row>
              <Col>
                <S.OrderItemWrapperRight>
                  <S.OrderItemContent>
                    <FaIcons.FaDollarSign />
                    <NumberFormat
                      value={order.total}
                      displayType="text"
                      decimalSeparator=","
                      fixedDecimalScale
                      decimalScale={2}
                    />
                  </S.OrderItemContent>
                </S.OrderItemWrapperRight>
              </Col>
            </Row>
          </Col>
        </Row>
      </S.OrderItem>
    </S.Container>
  )
}
