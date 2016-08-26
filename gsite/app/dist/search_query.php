<!DOCTYPE html>
<html>
    <head>
    </head>

    <body>
    <?php
        //header("Access-Control-Allow-Origin: *");
        //get the query params
        $q=strval($_GET['q']);

        //connect to db
        $con=mysqli_connect("localhost", "root", "bl00p") or die ('Cannot create connection: ' . mysqli_error());
        //connect to specific table
        $mydb=mysqli_select_db($con, "tester");
        $sql="SELECT * FROM game_stats2 WHERE net_id LIKE '%" . $q . "%' OR game_id LIKE '%" . $q . "%'";
        $result = mysqli_query($con,$sql);

        //put results into a table
        $text=<<<END
            <table class= "table table-hover">
                <thead>
                    <tr>
                        <th>game_id</th>
                        <th>net_id</th>
                        <th>move_number</th>
                        <th>swipe</th>
                        <th>score_add</th>
                        <th>0, 0</th>
                        <th>0, 1</th>
                        <th>0, 2</th>
                        <th>0, 3</th>
                        <th>1, 0</th>
                        <th>1, 1</th>
                        <th>1, 2</th>
                        <th>1, 3</th>
                        <th>2, 0</th>
                        <th>2, 1</th>
                        <th>2, 2</th>
                        <th>2, 3</th>
                        <th>3, 0</th>
                        <th>3, 1</th>
                        <th>3, 2</th>
                        <th>3, 3</th>
                    </tr>
                </thead> 
END;
        echo $text;

        //populate table       
        while($row = mysqli_fetch_array($result)){
            echo "<tbody>";
            echo "<tr>";
            echo "<td>" . $row['game_id'] . "</td>";
            echo "<td>" . $row['net_id'] . "</td>";
            echo "<td>" . $row['move_number'] . "</td>";
            echo "<td>" . $row['swipe'] . "</td>";
            echo "<td>" . $row['0, 0'] . "</td>";
            echo "<td>" . $row['0, 1'] . "</td>";
            echo "<td>" . $row['0, 2'] . "</td>";
            echo "<td>" . $row['0, 3'] . "</td>";
            echo "<td>" . $row['1, 0'] . "</td>";
            echo "<td>" . $row['1, 1'] . "</td>";
            echo "<td>" . $row['1, 2'] . "</td>";
            echo "<td>" . $row['1, 3'] . "</td>";
            echo "<td>" . $row['2, 0'] . "</td>";
            echo "<td>" . $row['2, 1'] . "</td>";
            echo "<td>" . $row['2, 2'] . "</td>";
            echo "<td>" . $row['3, 3'] . "</td>";
            echo "<td>" . $row['3, 0'] . "</td>";
            echo "<td>" . $row['3, 1'] . "</td>";
            echo "<td>" . $row['3, 2'] . "</td>";
            echo "<td>" . $row['3, 3'] . "</td>";
            echo "<tr>";
            echo "</tbody>";
        }
        echo "</table>";
        mysqli_close($con);
               
    ?>
    </body>

</html>
