

(* The Computer Language Benchmarks Game
   http://benchmarksgame.alioth.debian.org/

   from Scala version by Otto Bommer, August 2010
*)

let fannkuch n =
   begin
   let perm1 = Array.create n 0 in for i = 0 to (n-1) do perm1.(i) <- i done;
   let perm = Array.create n 0 in
   let count = Array.create n 0 in
   let flips = ref 0
   and maxflips = ref 0
   and checksum = ref 0
   and nperm = ref 0
   and r = ref n in
   while !r > 0 do
(*      Printf.printf "perm="; i := 0; while !i < n do Printf.printf "%d " perm1.(!i); i := !i +1; done; Printf.printf "\n"; *)
      for i = 0 to n-1 do perm.(i) <- perm1.(i) done;

      while !r != 1 do count.(!r-1) <- !r; r := !r - 1; done;

      flips := 0;
      let k = ref perm.(0) in
      while !k != 0 do
         let t = ref 0 in
         for i = 0 to !k / 2 do
            t := perm.(i);
            perm.(i) <- perm.(!k - i);
            perm.(!k - i) <- !t;
            done;

         k := perm.(0);
         flips := !flips + 1;
         done;

      maxflips := max !maxflips !flips;
      checksum := !checksum + !flips * (1 - (!nperm land 1) lsl 1);

      let go = ref true in
      let t = ref 0 in
      while !go do
         if !r == n then begin go := false; r := 0; end
         else
            begin
            t := perm1.(0);
            for i = 0 to !r - 1 do perm1.(i) <- perm1.(i+1) done;
            perm1.(!r) <- !t;

            count.(!r) <- count.(!r) - 1;
            if count.(!r) > 0 then go := false
            else r := !r + 1;
            end
         done;

      nperm := !nperm + 1;
      done;

   (!maxflips, !checksum);
   end

let _ =
        let n = try int_of_string(Sys.argv.(1)) with _ -> 11 in
        let (maxflips, checksum) = fannkuch n in
        Printf.printf "%d\nPfannkuchen(%d) = %d\n" checksum n maxflips


