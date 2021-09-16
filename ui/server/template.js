import serialize from 'serialize-javascript';

export default function template(body, data) {
  return `<!DOCTYPE HTML>
<html>

<head>
    <meta charset="utf-8">
    <title>Academic Insight</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://apis.google.com/js/api:client.js"></script>
    
    <style>
        table.bordered-table th, td {border: 1px solid silver; padding: 4px;}
        table.bordered-table {border-collapse: collapse;}
        a.active {background-color: #D8D8F5;}
        .panel-title a {display: block; width: 100%; cursor: pointer;}
    </style>
</head>

<body>
    <!-- Page generated from template. -->
    <div id="contents">${body}</div>  
    <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
    <script src="/env.js"></script>
    <script src="/vendor.bundle.js"></script>
    <script src="/app.bundle.js"></script>
</body>

</html>
`;
}
