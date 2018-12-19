<%--
  Created by IntelliJ IDEA.
  User: Ilse
  Date: 19-12-2018
  Time: 19:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Giraffes</title>
</head>
<body>
Giraffe #1 is ${requestScope.giraffes.first()}

<table>
    <thead></thead>
    <tbody>
        <c:forEach var="giraffe" items="${requestScope.giraffe}">
            <tr>
                ${giraffe}
            </tr>
        </c:forEach>
    </tbody>
</table>
</body>
</html>
