<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php include 'ilists.php'; ?>
    
</head>
<body>
    <h2>HTML Dynamic Input List TEST</h2>
    <div id="ilist-1" ilist-suplier="IListMateriasSuplier" ilist-title="Materias" ilist-inames="materias[]"></div>
    <script>
        generateIList(document.getElementById("ilist-1"));
    </script>
</body>
</html>